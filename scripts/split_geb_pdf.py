#!/usr/bin/env python3
# Split Hofstadter-GEB.pdf into one PDF per chapter.
# Run from repo root: python3 scripts/split_geb_pdf.py
# Output: pdfs/intro.pdf, pdfs/chapter-01.pdf ... pdfs/chapter-20.pdf

from pathlib import Path
from pypdf import PdfReader, PdfWriter

# 1-based start page of each segment (verified against PDF)
STARTS = [
    10, 41, 54, 72, 90, 135, 166, 189, 212, 254, 291, 343, 375, 412,
    444, 471, 502, 565, 600, 647, 690
]
OUTPUT_NAMES = [
    "intro",
    "chapter-01", "chapter-02", "chapter-03", "chapter-04", "chapter-05",
    "chapter-06", "chapter-07", "chapter-08", "chapter-09", "chapter-10",
    "chapter-11", "chapter-12", "chapter-13", "chapter-14", "chapter-15",
    "chapter-16", "chapter-17", "chapter-18", "chapter-19", "chapter-20",
]

def main():
    root = Path(__file__).resolve().parent.parent
    src = root / "Hofstadter-GEB.pdf"
    out_dir = root / "pdfs"
    if not src.exists():
        raise SystemExit("Source PDF not found: " + str(src))
    out_dir.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(str(src))
    total = len(reader.pages)
    for i, (start_1based, name) in enumerate(zip(STARTS, OUTPUT_NAMES)):
        end_1based = STARTS[i + 1] - 1 if i + 1 < len(STARTS) else total
        start_0 = start_1based - 1
        end_0 = end_1based
        writer = PdfWriter()
        for j in range(start_0, min(end_0 + 1, total)):
            writer.add_page(reader.pages[j])
        out_path = out_dir / (name + ".pdf")
        with open(out_path, "wb") as f:
            writer.write(f)
        print(name + ".pdf: pages " + str(start_1based) + "-" + str(end_1based))

if __name__ == "__main__":
    main()
