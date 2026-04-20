#!/usr/bin/env python3
"""Extract text from all PDFs in the parent 'Estudos Maria' directory into scripts/extracted/*.txt."""
import os
import sys
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    print("pypdf missing. Run: pip3 install pypdf", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent.parent
OUT = Path(__file__).resolve().parent / "extracted"
OUT.mkdir(exist_ok=True)

pdfs = sorted([p for p in ROOT.iterdir() if p.suffix.lower() == ".pdf"])
if not pdfs:
    print(f"No PDFs found at {ROOT}", file=sys.stderr)
    sys.exit(1)

for pdf in pdfs:
    out_file = OUT / (pdf.stem + ".txt")
    try:
        reader = PdfReader(str(pdf))
        chunks = []
        for i, page in enumerate(reader.pages):
            try:
                txt = page.extract_text() or ""
            except Exception as e:
                txt = f"[extract error page {i}: {e}]"
            chunks.append(f"\n--- page {i+1} ---\n{txt}")
        out_file.write_text("".join(chunks), encoding="utf-8")
        print(f"OK  {pdf.name} -> {out_file.name} ({len(reader.pages)} pages)")
    except Exception as e:
        print(f"ERR {pdf.name}: {e}", file=sys.stderr)
