#!/usr/bin/env python3
"""Scan a local dataroom folder and diff it against the classification manifest.

Outputs a JSON diff on stdout: new / modified / renamed / deleted / unchanged,
plus the existing classified tree (few-shot context) and taxonomy info.
A human-readable summary goes to stderr.

Usage:
    python scan_diff.py /path/to/dataroom
"""

import argparse
import hashlib
import json
import sys
import unicodedata
from pathlib import Path

SKIP_DIRS = {".dataroom", "_classified", "__MACOSX", "output"}
SKIP_FILES = {".DS_Store", "Thumbs.db", "desktop.ini"}
NON_CLASSIFIABLE = {".gif", ".zip", ".rar", ".7z"}


def file_hash(path: Path, size: int) -> str:
    """md5 of the first 64KB + file size — fast, good enough for rename detection."""
    h = hashlib.md5()
    with open(path, "rb") as fh:
        h.update(fh.read(65536))
    h.update(str(size).encode())
    return h.hexdigest()


def scan(dataroom: Path) -> dict:
    files = {}
    for p in sorted(dataroom.rglob("*")):
        if not p.is_file():
            continue
        rel = p.relative_to(dataroom)
        if any(part in SKIP_DIRS or part.startswith(".") for part in rel.parts[:-1]):
            continue
        if p.name in SKIP_FILES or p.name.startswith("."):
            continue
        size = p.stat().st_size
        # NFC canonical form: macOS filesystems return NFD, manifest keys are NFC
        rel_str = unicodedata.normalize("NFC", str(rel))
        files[rel_str] = {
            "path": rel_str,
            "ext": p.suffix.lower(),
            "size": size,
            "folder": unicodedata.normalize("NFC", str(rel.parent)) if str(rel.parent) != "." else "",
            "hash": file_hash(p, size),
            "classifiable": p.suffix.lower() not in NON_CLASSIFIABLE,
        }
    return files


def load_manifest(manifest_path: Path) -> dict:
    if manifest_path.exists():
        return json.loads(manifest_path.read_text())
    return {"version": 1, "taxonomy_template": None, "taxonomy": None, "files": {}}


def existing_tree(manifest: dict) -> dict:
    """Category/subcategory -> counts + a few example filenames (few-shot context)."""
    tree = {}
    for entry in manifest.get("files", {}).values():
        key = f"{entry.get('category', '?')} / {entry.get('sub_category', '?')}"
        node = tree.setdefault(key, {"count": 0, "examples": []})
        node["count"] += 1
        if len(node["examples"]) < 3:
            node["examples"].append(entry.get("new_name", ""))
    return tree


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("dataroom", help="Path to the dataroom folder")
    args = ap.parse_args()

    dataroom = Path(args.dataroom).expanduser().resolve()
    if not dataroom.is_dir():
        print(f"ERROR: {dataroom} is not a directory", file=sys.stderr)
        sys.exit(1)

    manifest_path = dataroom / ".dataroom" / "manifest.json"
    manifest = load_manifest(manifest_path)
    known = manifest.get("files", {})

    on_disk = scan(dataroom)

    new, modified, unchanged, deleted = [], [], [], []
    for rel, info in on_disk.items():
        entry = known.get(rel)
        if entry is None:
            new.append(info)
        elif entry.get("hash") != info["hash"]:
            modified.append(info)
        else:
            unchanged.append(rel)
    for rel in known:
        if rel not in on_disk:
            deleted.append(rel)

    # Rename detection: a deleted manifest entry whose hash reappears under a new path.
    deleted_by_hash = {known[rel]["hash"]: rel for rel in deleted if known[rel].get("hash")}
    renamed = []
    still_new = []
    for info in new:
        old_rel = deleted_by_hash.pop(info["hash"], None)
        if old_rel is not None:
            renamed.append({"from": old_rel, "to": info["path"]})
            deleted.remove(old_rel)
        else:
            still_new.append(info)
    new = still_new

    # Intra-run duplicates: several new files sharing the same hash — classify one, report the rest.
    by_hash = {}
    for info in new:
        by_hash.setdefault(info["hash"], []).append(info["path"])
    duplicates = [{"keep": sorted(paths, key=len)[0], "dupes": sorted(paths, key=len)[1:]}
                  for paths in by_hash.values() if len(paths) > 1]

    # New files whose content is already classified under another path — skip, just report.
    classified_hashes = {e["hash"]: rel for rel, e in known.items() if e.get("hash")}
    dup_of_classified = [{"path": info["path"], "same_as": classified_hashes[info["hash"]]}
                         for info in new if info["hash"] in classified_hashes]
    dup_paths = {d["path"] for d in dup_of_classified}
    new = [info for info in new if info["path"] not in dup_paths]

    diff = {
        "dataroom": str(dataroom),
        "manifest_path": str(manifest_path),
        "output_dir": str(dataroom / "_classified"),
        "taxonomy_template": manifest.get("taxonomy_template"),
        "has_taxonomy": bool(manifest.get("taxonomy")),
        "counts": {
            "new": len(new),
            "modified": len(modified),
            "renamed": len(renamed),
            "deleted": len(deleted),
            "unchanged": len(unchanged),
        },
        "new": new,
        "modified": modified,
        "renamed": renamed,
        "deleted": deleted,
        "duplicates": duplicates,
        "duplicates_of_classified": dup_of_classified,
        "existing_tree": existing_tree(manifest),
    }

    c = diff["counts"]
    print(
        f"Scan de {dataroom.name}: {len(on_disk)} fichiers sur disque — "
        f"{c['new']} nouveaux, {c['modified']} modifiés, {c['renamed']} renommés, "
        f"{c['deleted']} supprimés, {c['unchanged']} inchangés",
        file=sys.stderr,
    )
    print(json.dumps(diff, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
