#!/usr/bin/env python3
"""Assemble le web_payload final à partir des sections validées.

Usage : python3 assemble_payload.py work/sections/ work/web_payload.json

Lit chaque <SectionKey>.json du dossier, revalide (via validate_section.py),
ordonne selon l'ordre canonique du portail et écrit { "merged": [ ... ] }.
"""
import json
import subprocess
import sys
from pathlib import Path

CANONICAL_ORDER = [
    "ExecSum",
    "Dashboard",
    "PresentationEntreprise",
    "Actionnariat",
    "Management",
    "Marché",
    "Concurrents",
    "RiskOpp",
    "NotesMarché",
    "Deals",
    "Articles",
]


def main(sections_dir_str, out_path_str):
    sections_dir = Path(sections_dir_str)
    out_path = Path(out_path_str)
    validator = Path(__file__).parent / "validate_section.py"

    files = {p.stem: p for p in sections_dir.glob("*.json")}
    if not files:
        print(f"ERREUR: aucun fichier de section dans {sections_dir}")
        sys.exit(1)

    unknown = sorted(set(files) - set(CANONICAL_ORDER))
    if unknown:
        print(f"ATTENTION: sections hors ordre canonique (ajoutées en fin): {', '.join(unknown)}")

    failures = []
    for key, path in files.items():
        proc = subprocess.run(
            [sys.executable, str(validator), str(path)],
            capture_output=True,
            text=True,
        )
        if proc.returncode != 0:
            failures.append(f"{key}:\n{proc.stdout.strip()}")

    if failures:
        print("ASSEMBLAGE REFUSÉ — sections invalides :")
        for f in failures:
            print(f"--- {f}")
        sys.exit(1)

    ordered_keys = [k for k in CANONICAL_ORDER if k in files] + unknown
    merged = []
    for key in ordered_keys:
        content = json.loads(files[key].read_text(encoding="utf-8"))
        merged.append({key: content})

    out_path.write_text(
        json.dumps({"merged": merged}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"OK {out_path} — {len(merged)} sections: {', '.join(ordered_keys)}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("usage: assemble_payload.py <sections_dir> <out.json>")
        sys.exit(2)
    main(sys.argv[1], sys.argv[2])
