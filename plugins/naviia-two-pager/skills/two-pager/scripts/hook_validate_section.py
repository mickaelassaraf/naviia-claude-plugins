#!/usr/bin/env python3
"""Hook PostToolUse : valide automatiquement toute section Naviia écrite.

Reçoit l'événement JSON sur stdin (Claude Code / Cowork). Route selon le
chemin du fichier écrit :
  - work/sections/<Clé>.json        -> validate_section.py (two-pager)
  - work-im/sections/<slug>.json|md -> validate_im_section.py (analyse d'IM)
Code de sortie 2 = bloque et renvoie les motifs au modèle, qui doit corriger.
Pour tout autre fichier : sortie 0 silencieuse (le hook est global au run).
"""
import json
import re
import subprocess
import sys
from pathlib import Path

try:
    event = json.load(sys.stdin)
except Exception:
    sys.exit(0)

file_path = (event.get("tool_input") or {}).get("file_path") or ""
normalized = file_path.replace("\\", "/")

if re.search(r"work/sections/[^/]+\.json$", normalized):
    validator = Path(__file__).parent / "validate_section.py"
elif re.search(r"work-im/sections/[^/]+\.(json|md)$", normalized):
    validator = (
        Path(__file__).resolve().parents[2]
        / "im-analysis"
        / "scripts"
        / "validate_im_section.py"
    )
else:
    sys.exit(0)

proc = subprocess.run(
    [sys.executable, str(validator), file_path],
    capture_output=True,
    text=True,
    timeout=30,
)
if proc.returncode != 0:
    print(
        f"Section rejetée par la validation Naviia ({Path(file_path).name}) — "
        f"corriger puis réécrire :\n{proc.stdout.strip()}",
        file=sys.stderr,
    )
    sys.exit(2)

sys.exit(0)
