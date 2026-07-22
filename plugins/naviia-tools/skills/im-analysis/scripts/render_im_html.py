#!/usr/bin/env python3
"""Rendu HTML local d'une analyse d'IM Naviia (python pur, zéro dépendance).

Transforme les sections de work-im/sections/ (*.json SectionRow ou *.md) en
un fichier HTML autonome et sobre : palette indigo Naviia (#4338CA), sommaire
cliquable, key points, références de pages (p.XX) mises en évidence.

Le DOCX Cambria rendu par le serveur (render_im_docx) reste le livrable de
référence — ce HTML est un complément de lecture locale.

Usage :
    python3 render_im_html.py work-im/sections/ --html <sortie.html> [--deal "Nom du deal"]

Sans --html, la sortie est écrite dans <sections_dir>/../im_analysis.html.
Imprime un JSON {ok, out, sections} sur stdout.
"""
import argparse
import html
import json
import re
import sys
from pathlib import Path

INDIGO = "#4338CA"

PAGE_REF_RE = re.compile(r"\((?:\s*pp?\.?\s*\d+(?:\s*[-–,]\s*(?:pp?\.?\s*)?\d+)*\s*)\)", re.IGNORECASE)


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[àâä]", "a", text)
    text = re.sub(r"[éèêë]", "e", text)
    text = re.sub(r"[îï]", "i", text)
    text = re.sub(r"[ôö]", "o", text)
    text = re.sub(r"[ûüù]", "u", text)
    text = re.sub(r"ç", "c", text)
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text or "section"


def inline_md(text: str) -> str:
    """Échappe le HTML puis applique gras/italique/code et met en évidence (p.XX)."""
    out = html.escape(text, quote=False)
    out = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", out)
    out = re.sub(r"(?<!\*)\*([^*\n]+)\*(?!\*)", r"<em>\1</em>", out)
    out = re.sub(r"`([^`\n]+)`", r"<code>\1</code>", out)
    out = PAGE_REF_RE.sub(lambda m: f'<span class="pref">{m.group(0)}</span>', out)
    return out


def md_to_html(markdown: str) -> str:
    """Conversion markdown minimale : titres, listes, paragraphes."""
    lines = markdown.replace("\r\n", "\n").split("\n")
    parts = []
    para: list = []
    in_list = False

    def flush_para():
        nonlocal para
        if para:
            parts.append(f"<p>{inline_md(' '.join(para))}</p>")
            para = []

    def close_list():
        nonlocal in_list
        if in_list:
            parts.append("</ul>")
            in_list = False

    for line in lines:
        stripped = line.strip()
        heading = re.match(r"^(#{1,6})\s+(.*)$", stripped)
        bullet = re.match(r"^[-*]\s+(.*)$", stripped)
        if not stripped:
            flush_para()
            close_list()
        elif heading:
            flush_para()
            close_list()
            level = min(len(heading.group(1)) + 1, 6)  # h1 du md -> h2 (h1 = titre de page)
            parts.append(f"<h{level}>{inline_md(heading.group(2))}</h{level}>")
        elif bullet:
            flush_para()
            if not in_list:
                parts.append("<ul>")
                in_list = True
            parts.append(f"<li>{inline_md(bullet.group(1))}</li>")
        else:
            close_list()
            para.append(stripped)
    flush_para()
    close_list()
    return "\n".join(parts)


def load_sections(sections_dir: Path):
    """Lit les *.json (SectionRow) et *.md, triés par nom de fichier."""
    sections = []
    files = sorted(
        [p for p in sections_dir.iterdir() if p.suffix.lower() in (".json", ".md")],
        key=lambda p: p.name,
    )
    seen_stems = set()
    for path in files:
        # si <slug>.json et <slug>.md coexistent, le .json (SectionRow) prime
        if path.stem in seen_stems:
            continue
        if path.suffix.lower() == ".md" and (path.with_suffix(".json")).exists():
            continue
        seen_stems.add(path.stem)
        if path.suffix.lower() == ".json":
            try:
                row = json.loads(path.read_text(encoding="utf-8"))
            except json.JSONDecodeError as e:
                print(f"AVERTISSEMENT: {path.name} ignoré (JSON invalide: {e})", file=sys.stderr)
                continue
            title = (row.get("Section") or path.stem).strip()
            output = row.get("Output") or ""
            key_points = row.get("Key points") or row.get("Key Points") or []
        else:
            text = path.read_text(encoding="utf-8")
            m = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
            title = m.group(1).strip() if m else path.stem
            output = text
            key_points = []
        # retire le `# Titre` de tête du corps (il devient le <h2> de la section)
        output = re.sub(r"^\s*#\s+.+\n?", "", output, count=1)
        sections.append({"title": title, "output": output, "key_points": key_points})
    return sections


CSS = """
:root { --indigo: %(indigo)s; --ink: #1e1b34; --muted: #6b7280; --bg: #f8f8fc; --card: #ffffff; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Georgia, 'Times New Roman', serif; color: var(--ink);
       background: var(--bg); line-height: 1.65; }
header { background: var(--indigo); color: #fff; padding: 40px 48px 32px; }
header h1 { margin: 0 0 6px; font-size: 26px; font-weight: 600; letter-spacing: .3px; }
header .sub { opacity: .85; font-size: 14px; font-family: Helvetica, Arial, sans-serif; }
main { max-width: 860px; margin: 0 auto; padding: 32px 24px 64px; }
nav.toc { background: var(--card); border: 1px solid #e4e4f0; border-left: 4px solid var(--indigo);
          border-radius: 6px; padding: 18px 24px; margin-bottom: 32px; }
nav.toc h2 { margin: 0 0 10px; font-size: 15px; text-transform: uppercase; letter-spacing: 1px;
             color: var(--indigo); font-family: Helvetica, Arial, sans-serif; }
nav.toc ol { margin: 0; padding-left: 22px; }
nav.toc a { color: var(--ink); text-decoration: none; }
nav.toc a:hover { color: var(--indigo); text-decoration: underline; }
section.im { background: var(--card); border: 1px solid #e4e4f0; border-radius: 6px;
             padding: 28px 32px; margin-bottom: 28px; }
section.im > h2 { margin: 0 0 16px; font-size: 21px; color: var(--indigo);
                  border-bottom: 2px solid var(--indigo); padding-bottom: 8px; }
section.im h3 { font-size: 16px; margin: 22px 0 8px; color: var(--ink); }
section.im p { margin: 0 0 12px; text-align: justify; }
section.im ul { margin: 0 0 12px; padding-left: 24px; }
.pref { color: var(--indigo); font-size: .85em; font-family: Helvetica, Arial, sans-serif;
        white-space: nowrap; }
.keypoints { background: #eef2ff; border-radius: 6px; padding: 14px 18px; margin-top: 20px; }
.keypoints h4 { margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;
                color: var(--indigo); font-family: Helvetica, Arial, sans-serif; }
.keypoints ul { margin: 0; padding-left: 20px; font-size: 14px; }
footer { text-align: center; color: var(--muted); font-size: 12px; padding: 0 0 40px;
         font-family: Helvetica, Arial, sans-serif; }
a.top { font-size: 12px; font-family: Helvetica, Arial, sans-serif; color: var(--muted);
        text-decoration: none; float: right; }
""" % {"indigo": INDIGO}


def render(sections, deal: str) -> str:
    title = f"Analyse d'IM — {deal}" if deal else "Analyse d'IM"
    toc = []
    body = []
    for i, s in enumerate(sections, 1):
        anchor = f"s{i:02d}-{slugify(s['title'])}"
        toc.append(f'<li><a href="#{anchor}">{html.escape(s["title"])}</a></li>')
        kp = ""
        if s["key_points"]:
            items = "".join(f"<li>{inline_md(str(k))}</li>" for k in s["key_points"])
            kp = f'<div class="keypoints"><h4>Key points</h4><ul>{items}</ul></div>'
        body.append(
            f'<section class="im" id="{anchor}">'
            f'<a class="top" href="#toc">&uarr; sommaire</a>'
            f"<h2>{html.escape(s['title'])}</h2>"
            f"{md_to_html(s['output'])}{kp}</section>"
        )
    return (
        "<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n<meta charset=\"utf-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
        f"<title>{html.escape(title)}</title>\n<style>{CSS}</style>\n</head>\n<body>\n"
        f"<header><h1>{html.escape(title)}</h1>"
        f'<div class="sub">Naviia &middot; analyse d\'Information Memorandum &middot; '
        f"{len(sections)} sections</div></header>\n<main>\n"
        f'<nav class="toc" id="toc"><h2>Sommaire</h2><ol>{"".join(toc)}</ol></nav>\n'
        f"{''.join(body)}\n</main>\n"
        "<footer>Document de travail g&eacute;n&eacute;r&eacute; localement &mdash; "
        "le DOCX Naviia est le livrable de r&eacute;f&eacute;rence.</footer>\n"
        "</body>\n</html>\n"
    )


def main():
    parser = argparse.ArgumentParser(description="Rendu HTML local d'une analyse d'IM")
    parser.add_argument("sections_dir", help="dossier work-im/sections/")
    parser.add_argument("--html", dest="html_out", help="chemin du fichier HTML de sortie")
    parser.add_argument("--deal", default="", help="nom du deal (titre du document)")
    args = parser.parse_args()

    sections_dir = Path(args.sections_dir)
    if not sections_dir.is_dir():
        print(json.dumps({"ok": False, "error": f"dossier introuvable: {sections_dir}"}))
        sys.exit(1)

    sections = load_sections(sections_dir)
    if not sections:
        print(json.dumps({"ok": False, "error": "aucune section .json/.md exploitable"}))
        sys.exit(1)

    out = Path(args.html_out) if args.html_out else sections_dir.parent / "im_analysis.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(render(sections, args.deal), encoding="utf-8")

    print(json.dumps(
        {"ok": True, "out": str(out), "sections": [s["title"] for s in sections]},
        ensure_ascii=False,
    ))


if __name__ == "__main__":
    main()
