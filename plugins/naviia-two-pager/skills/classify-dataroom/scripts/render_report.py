#!/usr/bin/env python3
"""Render a visual HTML report of a classified dataroom — pure stdlib.

Reads .dataroom/manifest.json (+ taxonomy inside) and writes _classified/RAPPORT.html:
category breakdown, clickable file tree, duplicates, gap analysis.

Usage:
    python3 render_report.py --dataroom /path/to/dataroom
"""

import argparse
import hashlib
import html
import json
import unicodedata
from datetime import datetime
from pathlib import Path

SKIP_DIRS = {".dataroom", "_classified", "_classified_diff", "__MACOSX", "output"}

ENTITY_COLORS = ["#4338CA", "#0E7490", "#B45309", "#15803D", "#BE185D", "#6B7280"]


def esc(s):
    return html.escape(str(s or ""))


def file_hash(p: Path) -> str:
    size = p.stat().st_size
    h = hashlib.md5()
    with open(p, "rb") as fh:
        h.update(fh.read(65536))
    h.update(str(size).encode())
    return h.hexdigest()


def find_duplicates(dataroom: Path, files: dict) -> list:
    """Unclassified files on disk whose content matches a classified entry."""
    known_hashes = {e["hash"]: rel for rel, e in files.items() if e.get("hash")}
    known_paths = set(files)
    dupes = []
    for p in sorted(dataroom.rglob("*")):
        if not p.is_file():
            continue
        rel = unicodedata.normalize("NFC", str(p.relative_to(dataroom)))
        parts = Path(rel).parts
        if any(part in SKIP_DIRS or part.startswith(".") for part in parts[:-1]):
            continue
        if p.name.startswith(".") or rel in known_paths or parts[0].startswith("_classified"):
            continue
        h = file_hash(p)
        if h in known_hashes:
            dupes.append({"path": rel, "same_as": known_hashes[h]})
    return dupes


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dataroom", required=True)
    args = ap.parse_args()

    dataroom = Path(args.dataroom).expanduser().resolve()
    manifest = json.loads((dataroom / ".dataroom" / "manifest.json").read_text())
    taxonomy = manifest.get("taxonomy") or {}
    files = manifest.get("files", {})
    out_dir = dataroom / "_classified"

    # -- aggregate --
    by_cat = {}
    for src, e in files.items():
        by_cat.setdefault(e.get("category", "?"), []).append((src, e))
    entities = sorted({e.get("entity") for e in files.values() if e.get("entity")})
    entity_color = {ent: ENTITY_COLORS[i % len(ENTITY_COLORS)] for i, ent in enumerate(entities)}
    dupes = find_duplicates(dataroom, files)

    covered = {(e.get("category"), e.get("sub_category")) for e in files.values()}
    gaps = {}
    for cat, data in taxonomy.items():
        missing = [s for s in data.get("subcategories", []) if (cat, s["code"]) not in covered]
        if missing:
            gaps[cat] = (data.get("label", ""), missing, len(data.get("subcategories", [])))

    max_count = max((len(v) for v in by_cat.values()), default=1)
    now = datetime.now().strftime("%d/%m/%Y %H:%M")

    # -- html --
    H = []
    H.append(f"""<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dataroom — {esc(dataroom.name)}</title>
<style>
  :root {{ --indigo:#4338CA; --ink:#111827; --muted:#6B7280; --line:#E5E7EB;
          --wash:#EEF2FF; --bg:#F8FAFC; }}
  * {{ box-sizing:border-box; margin:0; }}
  body {{ font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
         background:var(--bg); color:var(--ink); }}
  .wrap {{ max-width:1080px; margin:0 auto; padding:0 28px 60px; }}
  header {{ background:linear-gradient(120deg,#312E81,var(--indigo)); color:#fff; padding:40px 0 32px; }}
  header .wrap {{ padding-bottom:0; }}
  .brand {{ font-size:12px; letter-spacing:.22em; text-transform:uppercase; opacity:.75; }}
  h1 {{ font-size:30px; font-weight:700; margin:8px 0 4px; }}
  .sub {{ opacity:.8; font-size:14px; }}
  .stats {{ display:flex; gap:14px; flex-wrap:wrap; margin:26px 0 0; transform:translateY(26px); }}
  .stat {{ background:#fff; border:1px solid var(--line); border-radius:12px; padding:14px 20px;
           min-width:130px; box-shadow:0 6px 18px rgba(17,24,39,.06); }}
  .stat b {{ display:block; font-size:26px; color:var(--indigo); }}
  .stat span {{ font-size:12px; color:var(--muted); }}
  main {{ margin-top:56px; }}
  h2 {{ font-size:15px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted);
        margin:38px 0 14px; }}
  .bars {{ display:grid; grid-template-columns:230px 1fr 46px; gap:8px 12px; align-items:center;
           background:#fff; border:1px solid var(--line); border-radius:12px; padding:18px 20px; }}
  .bars .lbl {{ font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }}
  .bars .track {{ background:var(--wash); border-radius:99px; height:10px; }}
  .bars .fill {{ background:var(--indigo); border-radius:99px; height:10px; }}
  .bars .n {{ font-size:13px; color:var(--muted); text-align:right; }}
  .cat {{ background:#fff; border:1px solid var(--line); border-radius:12px; margin-bottom:18px; overflow:hidden; }}
  .cat > .head {{ display:flex; align-items:baseline; gap:10px; padding:14px 20px;
                  background:var(--wash); border-bottom:1px solid var(--line); }}
  .cat .code {{ font-size:12px; font-weight:700; color:var(--indigo); letter-spacing:.06em; }}
  .cat .name {{ font-size:16px; font-weight:700; }}
  .cat .count {{ margin-left:auto; font-size:12px; color:var(--muted); }}
  .sub-block {{ padding:10px 20px 4px; }}
  .sub-title {{ font-size:12px; color:var(--muted); font-weight:600; margin:8px 0 6px; }}
  .doc {{ display:flex; align-items:center; gap:10px; padding:7px 0; border-top:1px dashed var(--line);
          font-size:13.5px; flex-wrap:wrap; }}
  .doc:first-of-type {{ border-top:none; }}
  .doc a {{ color:var(--ink); text-decoration:none; font-weight:600; }}
  .doc a:hover {{ color:var(--indigo); text-decoration:underline; }}
  .badge {{ font-size:11px; font-weight:600; padding:2px 9px; border-radius:99px; color:#fff; }}
  .date {{ font-size:12px; color:var(--muted); font-variant-numeric:tabular-nums; }}
  .src {{ flex-basis:100%; font-size:11.5px; color:#9CA3AF; padding-left:2px; }}
  .dup {{ background:#fff; border:1px solid var(--line); border-radius:12px; padding:6px 20px; }}
  .dup .doc b {{ font-weight:600; }}
  .gap-cat {{ margin-bottom:14px; }}
  .gap-cat .t {{ font-size:13px; font-weight:700; margin-bottom:6px; }}
  .gap-cat .t small {{ color:var(--muted); font-weight:400; }}
  .chips {{ display:flex; flex-wrap:wrap; gap:6px; }}
  .chip {{ font-size:11.5px; background:#fff; border:1px solid var(--line); color:var(--muted);
           border-radius:99px; padding:3px 10px; }}
  .chip.empty-cat {{ border-color:#FCA5A5; background:#FEF2F2; color:#B91C1C; }}
  footer {{ margin-top:44px; font-size:12px; color:var(--muted); border-top:1px solid var(--line);
            padding-top:16px; display:flex; justify-content:space-between; }}
  @media print {{ .stat {{ box-shadow:none; }} header {{ -webkit-print-color-adjust:exact; }} }}
</style></head><body>
<header><div class="wrap">
  <div class="brand">Naviia — Dataroom</div>
  <h1>{esc(dataroom.name)}</h1>
  <div class="sub">Classification générée le {now} — taxonomie « {esc(manifest.get('taxonomy_template') or 'custom')} »</div>
  <div class="stats">
    <div class="stat"><b>{len(files)}</b><span>documents classés</span></div>
    <div class="stat"><b>{len(by_cat)}/{len(taxonomy)}</b><span>catégories couvertes</span></div>
    <div class="stat"><b>{len(dupes)}</b><span>doublons écartés</span></div>
    <div class="stat"><b>{sum(len(m) for _, m, _ in gaps.values())}</b><span>rubriques sans document</span></div>
  </div>
</div></header>
<main><div class="wrap">""")

    # répartition
    H.append('<h2>Répartition</h2><div class="bars">')
    for cat in sorted(by_cat):
        n = len(by_cat[cat])
        label = taxonomy.get(cat, {}).get("label", cat)
        pct = max(4, round(100 * n / max_count))
        H.append(f'<div class="lbl">{esc(cat)} — {esc(label)}</div>'
                 f'<div class="track"><div class="fill" style="width:{pct}%"></div></div>'
                 f'<div class="n">{n}</div>')
    H.append("</div>")

    # arbre documentaire
    H.append("<h2>Documents</h2>")
    for cat in sorted(by_cat):
        entries = sorted(by_cat[cat], key=lambda kv: (kv[1].get("sub_category", ""), kv[1].get("new_name", "")))
        label = taxonomy.get(cat, {}).get("label", "")
        H.append(f'<div class="cat"><div class="head"><span class="code">{esc(cat)}</span>'
                 f'<span class="name">{esc(label)}</span><span class="count">{len(entries)} doc(s)</span></div>')
        current_sub = None
        for src, e in entries:
            sub = e.get("sub_category", "?")
            if sub != current_sub:
                if current_sub is not None:
                    H.append("</div>")
                sub_label = next((s["label"] for s in taxonomy.get(cat, {}).get("subcategories", [])
                                  if s["code"] == sub), "")
                H.append(f'<div class="sub-block"><div class="sub-title">{esc(sub)} — {esc(sub_label)}</div>')
                current_sub = sub
            badge = ""
            if e.get("entity"):
                color = entity_color.get(e["entity"], "#6B7280")
                badge = f'<span class="badge" style="background:{color}">{esc(e["entity"])}</span>'
            date = f'<span class="date">{esc(e["date"])}</span>' if e.get("date") else ""
            href = esc(e.get("target", ""))
            H.append(f'<div class="doc"><a href="{href}">{esc(e.get("new_name", "?"))}</a>'
                     f'{badge}{date}<span class="src">source : {esc(src)}</span></div>')
        if current_sub is not None:
            H.append("</div>")
        H.append("</div>")

    # doublons
    if dupes:
        H.append('<h2>Doublons écartés (contenu identique, non classés)</h2><div class="dup">')
        for d in dupes:
            H.append(f'<div class="doc"><b>{esc(d["path"])}</b>'
                     f'<span class="src">identique à : {esc(d["same_as"])}</span></div>')
        H.append("</div>")

    # gap analysis
    if gaps:
        H.append('<h2>Gap analysis — rubriques sans document</h2>')
        for cat in sorted(gaps):
            label, missing, total = gaps[cat]
            empty_cat = len(missing) == total
            flag = ' <small>(catégorie entièrement vide)</small>' if empty_cat else ""
            H.append(f'<div class="gap-cat"><div class="t">{esc(cat)} — {esc(label)}{flag}</div><div class="chips">')
            for s in missing:
                cls = "chip empty-cat" if empty_cat else "chip"
                H.append(f'<span class="{cls}">{esc(s["code"])} {esc(s["label"])}</span>')
            H.append("</div></div>")

    H.append(f"""<footer><span>Naviia — classify-dataroom</span>
<span>{len(files)} documents — index : INDEX.md / index.csv</span></footer>
</div></main></body></html>""")

    out = out_dir / "RAPPORT.html"
    out_dir.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(H))
    print(f"rapport: {out}")


if __name__ == "__main__":
    main()
