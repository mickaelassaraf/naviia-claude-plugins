#!/usr/bin/env python3
"""Extract text heads from Office/text files — pure stdlib, no dependencies.

Handles: .docx .xlsx .pptx (zip+XML), .txt .csv .xml .json .html .md, .zip (file listing).
Does NOT handle .pdf / images — read those with Claude Code's Read tool (first 1-2 pages).

Usage:
    python3 extract.py --dataroom /path/to/dataroom "rel/a.docx" "rel/b.xlsx" ...
Output: JSON list on stdout — [{path, text, note}]
"""

import argparse
import json
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

MAX_CHARS = 1500


def _xml_text(data: bytes, sep: str = " ") -> str:
    """All text nodes of an XML document, in order."""
    try:
        root = ET.fromstring(data)
    except ET.ParseError:
        return ""
    return sep.join(t.strip() for t in root.itertext() if t.strip())


def extract_docx(path: Path) -> str:
    with zipfile.ZipFile(path) as z:
        data = z.read("word/document.xml")
    # paragraph breaks -> newlines for readability
    data = re.sub(rb"</w:p>", b"</w:p>\n", data)
    parts = []
    for chunk in data.split(b"\n"):
        if not chunk.strip():
            continue
        txt = " ".join(re.findall(r">([^<>]+)<", chunk.decode("utf-8", "ignore")))
        txt = re.sub(r"\s+", " ", txt).strip()
        if txt:
            parts.append(txt)
    return "\n".join(parts)


def extract_xlsx(path: Path) -> str:
    out = []
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
        if "xl/workbook.xml" in names:
            wb = ET.fromstring(z.read("xl/workbook.xml"))
            sheets = [e.get("name", "") for e in wb.iter() if e.tag.endswith("}sheet")]
            if sheets:
                out.append("Onglets: " + ", ".join(sheets))
        if "xl/sharedStrings.xml" in names:
            root = ET.fromstring(z.read("xl/sharedStrings.xml"))
            strings = [t for t in root.itertext() if t.strip()]
            out.append(" | ".join(strings[:120]))
    return "\n".join(out)


def extract_pptx(path: Path) -> str:
    out = []
    with zipfile.ZipFile(path) as z:
        slides = sorted(n for n in z.namelist()
                        if re.fullmatch(r"ppt/slides/slide\d+\.xml", n))[:3]
        for name in slides:
            txt = _xml_text(z.read(name))
            if txt:
                out.append(txt)
    return "\n---\n".join(out)


def extract_zip_listing(path: Path) -> str:
    with zipfile.ZipFile(path) as z:
        names = [n for n in z.namelist() if not n.endswith("/")][:40]
    return "Archive contenant: " + ", ".join(names)


def extract_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


EXTRACTORS = {
    ".docx": extract_docx,
    ".xlsx": extract_xlsx,
    ".xlsm": extract_xlsx,
    ".pptx": extract_pptx,
    ".zip": extract_zip_listing,
    ".txt": extract_text,
    ".csv": extract_text,
    ".xml": extract_text,
    ".json": extract_text,
    ".html": extract_text,
    ".htm": extract_text,
    ".md": extract_text,
}


def read_one(dataroom: Path, rel: str, max_chars: int) -> dict:
    abs_path = dataroom / rel
    ext = abs_path.suffix.lower()
    result = {"path": rel, "text": "", "note": ""}
    if not abs_path.is_file():
        result["note"] = "not_found"
        return result
    if ext in (".pdf", ".jpg", ".jpeg", ".png", ".tiff", ".bmp", ".gif"):
        result["note"] = "use_read_tool"
        return result
    fn = EXTRACTORS.get(ext)
    if fn is None:
        result["note"] = f"unsupported_extension:{ext}"
        return result
    try:
        result["text"] = fn(abs_path)[:max_chars]
    except Exception as e:
        result["note"] = f"extraction_error: {type(e).__name__}: {e}"
    return result


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dataroom", required=True)
    ap.add_argument("--max-chars", type=int, default=MAX_CHARS)
    ap.add_argument("paths", nargs="+")
    args = ap.parse_args()

    dataroom = Path(args.dataroom).expanduser().resolve()
    results = [read_one(dataroom, p, args.max_chars) for p in args.paths]
    print(json.dumps(results, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
