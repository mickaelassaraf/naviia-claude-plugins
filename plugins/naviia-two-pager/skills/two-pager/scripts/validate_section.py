#!/usr/bin/env python3
"""Valide une section de two-pager (fichier JSON) avant assemblage.

Usage : python3 validate_section.py work/sections/<SectionKey>.json
Sort avec le code 0 si OK, 1 sinon (motifs listés sur stdout).

Règles générales : JSON parseable, contenu non vide, volume minimal,
aucun placeholder {{...}} non résolu, sources présentes pour les sections
narratives. Règles spécifiques par section (Dashboard, RiskOpp).
"""
import json
import re
import sys
from pathlib import Path
from typing import NoReturn

MIN_JSON_CHARS = {
    "Dashboard": 600,
    "PresentationEntreprise": 800,
    "Actionnariat": 200,
    "Management": 300,
    "Marché": 800,
    "Concurrents": 300,
    "RiskOpp": 500,
}
DEFAULT_MIN_CHARS = 150

NARRATIVE_SOURCED = {"PresentationEntreprise", "Marché"}


def fail(reasons) -> NoReturn:
    for r in reasons:
        print(f"REJET: {r}")
    sys.exit(1)


def main(path_str):
    path = Path(path_str)
    reasons = []

    if not path.exists():
        fail([f"fichier introuvable: {path}"])

    raw = path.read_text(encoding="utf-8")
    try:
        content = json.loads(raw)
    except json.JSONDecodeError as e:
        fail([f"JSON invalide ({e})"])

    section_key = path.stem
    body = json.dumps(content, ensure_ascii=False)

    if re.search(r"\{\{[A-Z_]+\}\}", body):
        reasons.append("placeholder {{...}} non résolu dans le contenu")

    min_chars = MIN_JSON_CHARS.get(section_key, DEFAULT_MIN_CHARS)
    if len(body) < min_chars:
        reasons.append(f"contenu trop maigre ({len(body)} caractères JSON < {min_chars})")

    if section_key in NARRATIVE_SOURCED:
        if "http" not in body:
            reasons.append("aucune source URL citée dans une section narrative")

    if section_key == "Dashboard":
        root = content.get("Dashboard", content)
        for req in ("Caractéristiques", "KPIs"):
            if req not in root and req.lower() not in {k.lower() for k in root}:
                reasons.append(f"Dashboard: clé requise absente ({req})")
        if not isinstance(root.get("KPIs", []), list):
            reasons.append("Dashboard: KPIs doit être une liste [{label, value}]")

    if section_key == "RiskOpp":
        root = content.get("RiskOpp", content)
        risques = root.get("Risques") or root.get("risques")
        opps = root.get("Opportunités") or root.get("Opportunites") or root.get("opportunites")
        if not risques and not opps:
            reasons.append("RiskOpp: ni Risques ni Opportunités présents")
        for label, block in (("Risques", risques), ("Opportunités", opps)):
            if not isinstance(block, dict):
                continue
            for title, item in block.items():
                if title.lower() == "sources":
                    continue
                if not isinstance(item, dict):
                    reasons.append(f"RiskOpp/{label}/{title}: objet attendu")
                    continue
                for field in ("note_I", "note_P", "arguments_I", "arguments_P"):
                    if field not in item:
                        reasons.append(f"RiskOpp/{label}/{title}: champ manquant ({field})")

    if section_key == "Management":
        managers = content.get("managers")
        if not isinstance(managers, list) or not managers:
            reasons.append('Management: format attendu {"managers": [ ... ]} non vide')

    if reasons:
        fail(reasons)

    print(f"OK {section_key} ({len(body)} caractères JSON)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: validate_section.py <section.json>")
        sys.exit(2)
    main(sys.argv[1])
