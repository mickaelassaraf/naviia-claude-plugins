#!/usr/bin/env python3
"""Valide une section d'analyse d'IM avant rendu.

Usage : python3 validate_im_section.py work-im/sections/<NN>-<slug>.json
Sort avec le code 0 si OK, 1 sinon (motifs listés sur stdout).

Règles : fichier existant, SectionRow complète pour les .json
({Section, Output, "Key points"}), Output d'au moins 400 caractères,
aucun placeholder {{...}} non résolu, présence de références de pages
type (p.XX). Les fichiers .md sont validés sur leur texte brut avec
les mêmes règles de volume/placeholders/citations.
"""
import json
import re
import sys
from pathlib import Path
from typing import NoReturn

MIN_OUTPUT_CHARS = 400
PLACEHOLDER_RE = re.compile(r"\{\{[^}]+\}\}")
# (p.12), (p. 12), (pp. 12-14), (p.12, p.34)
PAGE_REF_RE = re.compile(r"\(\s*pp?\.?\s*\d+", re.IGNORECASE)


def fail(reasons) -> NoReturn:
    for r in reasons:
        print(f"REJET: {r}")
    sys.exit(1)


def check_text(text: str, reasons: list, label: str = "Output") -> None:
    if len(text) < MIN_OUTPUT_CHARS:
        reasons.append(
            f"{label} trop maigre ({len(text)} caractères < {MIN_OUTPUT_CHARS})"
        )
    if PLACEHOLDER_RE.search(text):
        reasons.append(f"placeholder {{{{...}}}} non résolu dans {label}")
    if not PAGE_REF_RE.search(text):
        reasons.append(
            f"aucune référence de page (p.XX) dans {label} — "
            "chaque paragraphe doit citer ses pages de l'IM"
        )


def main(path_str: str) -> None:
    path = Path(path_str)
    reasons = []

    if not path.exists():
        fail([f"fichier introuvable: {path}"])

    raw = path.read_text(encoding="utf-8")

    if path.suffix.lower() == ".json":
        try:
            content = json.loads(raw)
        except json.JSONDecodeError as e:
            fail([f"JSON invalide ({e})"])
        if not isinstance(content, dict):
            fail(["SectionRow attendue: objet {Section, Output, \"Key points\"}"])

        section = content.get("Section")
        output = content.get("Output")
        key_points = content.get("Key points") or content.get("Key Points")

        if not isinstance(section, str) or not section.strip():
            reasons.append("champ Section absent ou vide")
        if not isinstance(output, str) or not output.strip():
            reasons.append("champ Output absent ou vide")
            output = ""
        if not isinstance(key_points, list) or not key_points:
            reasons.append('champ "Key points" absent ou vide (liste attendue)')
        elif len(key_points) != 5:
            reasons.append(
                f'"Key points" : exactement 5 puces attendues (contrat n8n), {len(key_points)} fournies'
            )
        elif not all(isinstance(k, str) and k.strip() for k in key_points):
            reasons.append('"Key points": chaque entrée doit être une string non vide')

        if output:
            check_text(output, reasons)
            if re.search(r"^#\s*Key points\b", output, re.IGNORECASE | re.MULTILINE):
                reasons.append("Output ne doit pas contenir de bloc '# Key points'")
    else:
        check_text(raw, reasons, label="contenu")

    if reasons:
        fail(reasons)

    print(f"OK {path.stem} ({len(raw)} caractères)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: validate_im_section.py <section.json|section.md>")
        sys.exit(2)
    main(sys.argv[1])
