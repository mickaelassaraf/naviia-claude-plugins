#!/usr/bin/env python3
"""Apply a classification plan: copy files into the organized tree, update the
manifest, and regenerate the index.

Handles automatically (before applying the plan):
  - renames: manifest entries whose hash reappears under a new source path inherit
    their classification (the entry is re-keyed, nothing is re-copied)
  - deletions: manifest entries whose source no longer exists are removed and their
    classified copy is deleted

Plan JSON format:
{
  "taxonomy_template": "default",          # first run only (or "custom")
  "taxonomy_file": "/abs/path.json",       # optional override, first run only
  "items": [
    {"path": "rel/source.pdf", "category": "02_Financier", "sub_category": "02.1",
     "new_name": "Comptes_Annuels_2023.pdf", "date": "2023-12-31",
     "entity": "Dupont SAS", "doc_type": "Comptes annuels"}
  ]
}

Usage:
    python apply_plan.py --dataroom /path/to/dataroom --plan plan.json [--dry-run]
"""

import argparse
import csv
import io
import json
import re
import shutil
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

TAXONOMY_DIR = Path(__file__).resolve().parent.parent / "taxonomies"


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def slug(text: str, max_len: int = 60) -> str:
    """Directory-safe ASCII slug: accents stripped, separators -> underscore."""
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s/-]+", "_", text).strip("_")
    return text[:max_len]


def sanitize_name(name: str) -> str:
    """Filename-safe: keep accents, strip forbidden characters."""
    name = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "", name).strip()
    return name[:100] or "unnamed"


def file_hash(path: Path) -> str:
    import hashlib

    size = path.stat().st_size
    h = hashlib.md5()
    with open(path, "rb") as fh:
        h.update(fh.read(65536))
    h.update(str(size).encode())
    return h.hexdigest()


def load_taxonomy(plan: dict, manifest: dict) -> tuple[dict, str]:
    if manifest.get("taxonomy"):
        return manifest["taxonomy"], manifest.get("taxonomy_template") or "custom"
    if plan.get("taxonomy_file"):
        return json.loads(Path(plan["taxonomy_file"]).read_text()), "custom"
    template = plan.get("taxonomy_template", "default")
    tax_path = TAXONOMY_DIR / f"{template}.json"
    if not tax_path.exists():
        sys.exit(f"ERROR: unknown taxonomy template '{template}' ({tax_path} not found)")
    return json.loads(tax_path.read_text()), template


def target_rel_path(taxonomy: dict, item: dict) -> str:
    cat = item["category"]
    sub_code = item["sub_category"]
    if cat not in taxonomy:
        raise ValueError(f"unknown category '{cat}'")
    sub = next((s for s in taxonomy[cat].get("subcategories", []) if s["code"] == sub_code), None)
    if sub is None:
        raise ValueError(f"unknown sub_category '{sub_code}' in {cat}")

    name = sanitize_name(item["new_name"])
    src_ext = Path(item["path"]).suffix
    if src_ext and not name.lower().endswith(src_ext.lower()):
        name = (Path(name).stem if Path(name).suffix else name) + src_ext

    date = item.get("date") or ""
    if re.match(r"^\d{4}-\d{2}-\d{2}$", date):
        prefix = date.replace("-", "_")
        stem, ext = Path(name).stem, Path(name).suffix
        if not stem.startswith(prefix) and not stem.startswith(date):
            name = f"{prefix}_{stem}{ext}"

    sub_dir = f"{sub_code}_{slug(sub['label'])}"
    return f"{cat}/{sub_dir}/{name}"


def dedupe_target(target: str, taken: set) -> str:
    if target not in taken:
        return target
    p = Path(target)
    v = 2
    while True:
        candidate = str(p.parent / f"{p.stem}_v{v}{p.suffix}")
        if candidate not in taken:
            return candidate
        v += 1


def sub_label(taxonomy: dict, cat: str, sub_code: str) -> str:
    return next((s["label"] for s in taxonomy.get(cat, {}).get("subcategories", [])
                 if s["code"] == sub_code), "")


def prune_empty_dirs(output_dir: Path):
    """Remove empty directories left behind after deleted/re-classified copies."""
    if not output_dir.is_dir():
        return
    for d in sorted((p for p in output_dir.rglob("*") if p.is_dir()),
                    key=lambda p: len(p.parts), reverse=True):
        try:
            d.rmdir()  # only succeeds if empty
        except OSError:
            pass


def regenerate_index(dataroom: Path, output_dir: Path, manifest: dict, dry_run: bool):
    entries = sorted(
        manifest["files"].items(),
        key=lambda kv: (kv[1].get("category", ""), kv[1].get("sub_category", ""), kv[1].get("new_name", "")),
    )
    taxonomy = manifest.get("taxonomy") or {}

    md = [f"# Index — {dataroom.name}", "",
          f"Mis à jour le {now_iso()} — {len(entries)} fichiers classés", ""]
    current_cat, current_sub = None, None
    for src, e in entries:
        cat, sub = e.get("category", "?"), e.get("sub_category", "?")
        if cat != current_cat:
            label = taxonomy.get(cat, {}).get("label", "")
            if current_cat is not None:
                md.append("")
            md += [f"## {cat} — {label}", ""]
            current_cat, current_sub = cat, None
        if sub != current_sub:
            if current_sub is not None:
                md.append("")
            md += [f"### {sub} — {sub_label(taxonomy, cat, sub)}", ""]
            current_sub = sub
        md.append(f"- **{e.get('new_name', '?')}** ← `{src}`")
    md.append("")

    csv_buf = io.StringIO()
    writer = csv.writer(csv_buf)
    writer.writerow(["source_path", "category", "sub_category", "new_name", "target",
                     "date", "entity", "doc_type", "classified_at"])
    for src, e in entries:
        writer.writerow([src, e.get("category", ""), e.get("sub_category", ""),
                         e.get("new_name", ""), e.get("target", ""), e.get("date", ""),
                         e.get("entity", ""), e.get("doc_type", ""), e.get("classified_at", "")])

    if not dry_run:
        output_dir.mkdir(parents=True, exist_ok=True)
        (output_dir / "INDEX.md").write_text("\n".join(md))
        (output_dir / "index.csv").write_text(csv_buf.getvalue())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dataroom", required=True)
    ap.add_argument("--plan", required=True)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    dataroom = Path(args.dataroom).expanduser().resolve()
    output_dir = dataroom / "_classified"
    manifest_path = dataroom / ".dataroom" / "manifest.json"
    plan = json.loads(Path(args.plan).read_text())

    if manifest_path.exists():
        manifest = json.loads(manifest_path.read_text())
    else:
        manifest = {"version": 1, "taxonomy_template": None, "taxonomy": None,
                    "created_at": now_iso(), "files": {}}

    taxonomy, template = load_taxonomy(plan, manifest)
    manifest["taxonomy"], manifest["taxonomy_template"] = taxonomy, template

    report = {"applied": [], "renamed": [], "deleted": [], "errors": [], "dry_run": args.dry_run}

    # -- 1. Renames: re-key manifest entries whose hash moved to a new path --
    missing = {rel: e for rel, e in manifest["files"].items() if not (dataroom / rel).is_file()}
    if missing:
        known_paths = set(manifest["files"])
        hash_on_disk = {}
        for p in sorted(dataroom.rglob("*")):
            if not p.is_file():
                continue
            rel = unicodedata.normalize("NFC", str(p.relative_to(dataroom)))
            parts = Path(rel).parts
            if any(part.startswith(".") or part in {"_classified", "_classified_diff", "__MACOSX", "output"} for part in parts[:-1]):
                continue
            if p.name.startswith(".") or rel in known_paths or parts[0].startswith("_classified"):
                continue
            hash_on_disk.setdefault(file_hash(p), rel)
        for old_rel, entry in list(missing.items()):
            new_rel = hash_on_disk.pop(entry.get("hash", ""), None)
            if new_rel:
                manifest["files"][new_rel] = manifest["files"].pop(old_rel)
                report["renamed"].append({"from": old_rel, "to": new_rel})
                del missing[old_rel]

    # -- 2. Deletions: source gone, no rename found --
    for old_rel, entry in missing.items():
        target = output_dir / entry.get("target", "")
        if entry.get("target") and target.is_file() and not args.dry_run:
            target.unlink()
        if not args.dry_run:
            del manifest["files"][old_rel]
        report["deleted"].append(old_rel)

    # -- 3. Plan items: copy + record --
    taken = {e["target"] for e in manifest["files"].values() if e.get("target")}
    for item in plan.get("items", []):
        rel = unicodedata.normalize("NFC", item.get("path", ""))
        src = dataroom / rel
        try:
            if not src.is_file():
                raise ValueError("source file not found")
            previous = manifest["files"].get(rel)
            if previous and previous.get("target"):
                taken.discard(previous["target"])
                old_copy = output_dir / previous["target"]
                if old_copy.is_file() and not args.dry_run:
                    old_copy.unlink()

            target_rel = dedupe_target(target_rel_path(taxonomy, item), taken)
            taken.add(target_rel)
            target_abs = output_dir / target_rel
            if not args.dry_run:
                target_abs.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, target_abs)

            manifest["files"][rel] = {
                "hash": file_hash(src),
                "size": src.stat().st_size,
                "category": item["category"],
                "sub_category": item["sub_category"],
                "new_name": Path(target_rel).name,
                "target": target_rel,
                "date": item.get("date") or "",
                "entity": item.get("entity") or "",
                "doc_type": item.get("doc_type") or "",
                "classified_at": now_iso(),
            }
            report["applied"].append({"path": rel, "target": target_rel})
        except (ValueError, OSError) as e:
            report["errors"].append({"path": rel, "error": str(e)})

    # -- 4. Persist manifest + index --
    if not args.dry_run:
        manifest["updated_at"] = now_iso()
        manifest_path.parent.mkdir(parents=True, exist_ok=True)
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=1))
        prune_empty_dirs(output_dir)
    regenerate_index(dataroom, output_dir, manifest, args.dry_run)

    print(
        f"{'[DRY-RUN] ' if args.dry_run else ''}"
        f"{len(report['applied'])} classés, {len(report['renamed'])} renommés hérités, "
        f"{len(report['deleted'])} supprimés, {len(report['errors'])} erreurs",
        file=sys.stderr,
    )
    print(json.dumps(report, ensure_ascii=False, indent=1))
    if report["errors"]:
        sys.exit(2)


if __name__ == "__main__":
    main()
