#!/usr/bin/env python3
"""Export the last classification run as a standalone delta folder — pure stdlib.

Copies only the documents classified in the last run (or since --since) into
<dataroom>/_classified_diff/, mirroring the category tree, plus DIFF.md and diff.csv.
Use case: upload only the delta to a VDR instead of re-transferring everything.

Usage:
    python3 export_diff.py --dataroom /path/to/dataroom            # last run (default)
    python3 export_diff.py --dataroom /path/to/dataroom --since 2026-07-22T00:00:00Z
"""

import argparse
import csv
import io
import json
import shutil
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

RUN_GAP = timedelta(minutes=30)  # timestamps closer than this belong to the same run


def parse_ts(s: str) -> datetime:
    return datetime.strptime(s, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)


def last_run_cutoff(entries: list) -> datetime:
    """Start of the most recent run: walk timestamps backwards until a gap > RUN_GAP."""
    stamps = sorted(parse_ts(e["classified_at"]) for e in entries if e.get("classified_at"))
    if not stamps:
        sys.exit("ERROR: no classified_at timestamps in manifest")
    cutoff = stamps[-1]
    for ts in reversed(stamps[:-1]):
        if cutoff - ts > RUN_GAP:
            break
        cutoff = ts
    return cutoff


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dataroom", required=True)
    ap.add_argument("--since", help="ISO UTC (e.g. 2026-07-22T00:00:00Z); default: last run")
    args = ap.parse_args()

    dataroom = Path(args.dataroom).expanduser().resolve()
    manifest = json.loads((dataroom / ".dataroom" / "manifest.json").read_text())
    files = manifest.get("files", {})
    taxonomy = manifest.get("taxonomy") or {}

    cutoff = parse_ts(args.since) if args.since else last_run_cutoff(list(files.values()))
    delta = {src: e for src, e in files.items()
             if e.get("classified_at") and parse_ts(e["classified_at"]) >= cutoff}
    if not delta:
        sys.exit(f"Aucun document classé depuis {cutoff.strftime('%Y-%m-%dT%H:%M:%SZ')}")

    out = dataroom / "_classified_diff"
    if out.exists():
        shutil.rmtree(out)

    entries = sorted(delta.items(), key=lambda kv: (kv[1].get("category", ""),
                                                    kv[1].get("sub_category", ""),
                                                    kv[1].get("new_name", "")))
    md = [f"# Diff — {dataroom.name}", "",
          f"Documents classés depuis {cutoff.strftime('%d/%m/%Y %H:%M UTC')} : {len(entries)}", ""]
    csv_buf = io.StringIO()
    writer = csv.writer(csv_buf)
    writer.writerow(["source_path", "category", "sub_category", "new_name", "target",
                     "date", "entity", "doc_type", "classified_at"])

    current_cat = None
    copied = 0
    for src, e in entries:
        target = e.get("target", "")
        src_copy = dataroom / "_classified" / target
        if not src_copy.is_file():
            print(f"  ! copie introuvable, ignoré: {target}", file=sys.stderr)
            continue
        dest = out / target
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src_copy, dest)
        copied += 1

        cat = e.get("category", "?")
        if cat != current_cat:
            label = taxonomy.get(cat, {}).get("label", "")
            md += ["", f"## {cat} — {label}", ""]
            current_cat = cat
        md.append(f"- **{e.get('new_name', '?')}** ← `{src}`")
        writer.writerow([src, cat, e.get("sub_category", ""), e.get("new_name", ""), target,
                         e.get("date", ""), e.get("entity", ""), e.get("doc_type", ""),
                         e.get("classified_at", "")])

    md.append("")
    (out / "DIFF.md").write_text("\n".join(md))
    (out / "diff.csv").write_text(csv_buf.getvalue())
    print(f"{copied} documents exportés → {out}")


if __name__ == "__main__":
    main()
