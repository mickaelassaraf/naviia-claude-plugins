#!/usr/bin/env python3
"""Hook PostToolUse : valide automatiquement tout artefact Naviia écrit.

Reçoit l'événement JSON sur stdin (Claude Code / Cowork). Route selon le
chemin du fichier écrit :
  - work/sections/<Clé>.json        -> validate_section.py (two-pager)
  - work-im/sections/<slug>.json|md -> validate_im_section.py (analyse d'IM)
  - work*/steps/<id>.*              -> contrôles génériques d'étape
                                       (non vide, zéro {{PLACEHOLDER}}, JSON parseable)
  - work/web_payload.json           -> validation structurelle complète
                                       ({merged:[...]} + chaque section revalidée)
Code de sortie 2 = bloque et renvoie les motifs au modèle, qui doit corriger.
Pour tout autre fichier : sortie 0 silencieuse (le hook est global au run).
"""
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import NoReturn

PLACEHOLDER_RE = re.compile(r"\{\{[A-Z_]+\}\}")
MIN_STEP_CHARS = 200


def fail(reasons, label) -> NoReturn:
    print(
        f"Artefact rejeté par la validation Naviia ({label}) — corriger puis réécrire :\n"
        + "\n".join(f"- {r}" for r in reasons),
        file=sys.stderr,
    )
    sys.exit(2)


def run_validator(validator: Path, target: str) -> "subprocess.CompletedProcess[str]":
    return subprocess.run(
        [sys.executable, str(validator), target],
        capture_output=True,
        text=True,
        timeout=30,
    )


def check_step_output(path: Path):
    """Generic gate for intermediate step outputs: an unresolved placeholder
    here silently poisons every downstream step."""
    try:
        text = path.read_text(encoding="utf-8")
    except Exception:
        fail(["fichier illisible"], path.name)
    reasons = []
    if len(text.strip()) < MIN_STEP_CHARS:
        reasons.append(
            f"sortie d'étape trop courte ({len(text.strip())} caractères < {MIN_STEP_CHARS})"
        )
    unresolved = sorted(set(PLACEHOLDER_RE.findall(text)))
    if unresolved:
        reasons.append(
            "placeholders non substitués avant exécution : " + ", ".join(unresolved)
        )
    if path.suffix == ".json":
        try:
            json.loads(text)
        except json.JSONDecodeError as e:
            reasons.append(f"JSON invalide ({e})")
    if reasons:
        fail(reasons, path.name)


def check_web_payload(path: Path, section_validator: Path):
    """Full structural gate: writing work/web_payload.json by hand must meet
    the same bar as going through assemble_payload.py."""
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        fail([f"JSON invalide ({e})"], path.name)
    merged = payload.get("merged")
    if not isinstance(merged, list) or not merged:
        fail(['format attendu : {"merged": [ {"<Section>": contenu}, ... ]}'], path.name)
    reasons = []
    with tempfile.TemporaryDirectory() as tmp:
        for entry in merged:
            if not isinstance(entry, dict) or len(entry) != 1:
                reasons.append("chaque entrée de merged doit être {\"<Section>\": contenu}")
                continue
            key, content = next(iter(entry.items()))
            target = Path(tmp) / f"{key}.json"
            target.write_text(json.dumps(content, ensure_ascii=False), encoding="utf-8")
            proc = run_validator(section_validator, str(target))
            if proc.returncode != 0:
                reasons.append(f"{key}: {proc.stdout.strip()}")
    if reasons:
        fail(reasons, path.name)


try:
    event = json.load(sys.stdin)
except Exception:
    sys.exit(0)

file_path = (event.get("tool_input") or {}).get("file_path") or ""
normalized = file_path.replace("\\", "/")
here = Path(__file__).resolve()

if re.search(r"work/web_payload\.json$", normalized):
    check_web_payload(Path(file_path), here.parent / "validate_section.py")
    sys.exit(0)

if re.search(r"work(-im)?/steps/[^/]+\.[A-Za-z]+$", normalized):
    check_step_output(Path(file_path))
    sys.exit(0)

if re.search(r"work/sections/[^/]+\.json$", normalized):
    validator = here.parent / "validate_section.py"
elif re.search(r"work-im/sections/[^/]+\.(json|md)$", normalized):
    validator = here.parents[2] / "im-analysis" / "scripts" / "validate_im_section.py"
else:
    sys.exit(0)

proc = run_validator(validator, file_path)
if proc.returncode != 0:
    print(
        f"Section rejetée par la validation Naviia ({Path(file_path).name}) — "
        f"corriger puis réécrire :\n{proc.stdout.strip()}",
        file=sys.stderr,
    )
    sys.exit(2)

sys.exit(0)
