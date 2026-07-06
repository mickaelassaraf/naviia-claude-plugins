#!/usr/bin/env python3
"""Hook PostToolUse : valide automatiquement toute section two-pager écrite.

Reçoit l'événement JSON sur stdin (Claude Code / Cowork). Si le fichier écrit
est une section (work/sections/<Clé>.json), lance validate_section.py dessus.
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
if not re.search(r"work/sections/[^/]+\.json$", file_path.replace("\\", "/")):
    sys.exit(0)

validator = Path(__file__).parent / "validate_section.py"
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
