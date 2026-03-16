#!/usr/bin/env python3
"""Export all ELI5, ELI10, ELI20 content from chapter HTML files into one markdown file."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def html_to_md(html: str) -> str:
    """Convert simple chapter content HTML to markdown."""
    s = html.strip()
    # <h2>...</h2> -> ## ...
    s = re.sub(r"<h2>(.*?)</h2>", r"\n\n## \1\n\n", s, flags=re.DOTALL)
    # <p>...</p> -> paragraph (strip inner tags first for that paragraph)
    def p_sub(m):
        inner = m.group(1)
        inner = re.sub(r"<strong>(.*?)</strong>", r"**\1**", inner)
        inner = re.sub(r"<em>(.*?)</em>", r"*\1*", inner)
        inner = re.sub(r"<[^>]+>", "", inner)
        inner = inner.replace("&nbsp;", " ").strip()
        return "\n\n" + inner + "\n\n" if inner else ""
    s = re.sub(r"<p>(.*?)</p>", p_sub, s, flags=re.DOTALL)
    # Any remaining strong/em
    s = re.sub(r"<strong>(.*?)</strong>", r"**\1**", s)
    s = re.sub(r"<em>(.*?)</em>", r"*\1*", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = s.replace("&nbsp;", " ")
    # Collapse multiple newlines, strip each line, drop blank lines then rejoin
    lines = [ln.strip() for ln in s.splitlines()]
    lines = [ln for ln in lines if ln]
    s = "\n\n".join(lines)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def extract_panel(html: str, panel: str) -> str | None:
    """Extract content-inner HTML from the given reading panel (eli5, eli10, eli20)."""
    pattern = (
        r'<div data-reading-panel="'
        + re.escape(panel)
        + r'" class="reading-content"[^>]*>\s*<div class="content-inner">(.*?)</div>\s*</div>'
    )
    m = re.search(pattern, html, re.DOTALL)
    return m.group(1).strip() if m else None


def extract_title(html: str) -> str:
    """Extract the main h1 title."""
    m = re.search(r"<h1>(.*?)</h1>", html, re.DOTALL)
    if not m:
        return "Unknown"
    title = re.sub(r"<[^>]+>", "", m.group(1)).strip()
    return title


def main() -> None:
    out_lines = [
        "# GEB Companion: ELI5, ELI10, ELI20 Summaries",
        "",
        "All simplified chapter summaries from the GEB Interactive Companion, in one document.",
        "",
        "---",
        "",
    ]

    entries = [("intro",)] + [(f"chapter-{i:02d}",) for i in range(1, 21)]

    for (dirname,) in entries:
        path = ROOT / dirname / "index.html"
        if not path.exists():
            out_lines.append(f"## {dirname}\n\n*(missing: {path})*\n")
            continue
        html = path.read_text(encoding="utf-8")
        title = extract_title(html)
        out_lines.append(f"## {title}")
        out_lines.append("")

        for level, name in [("eli5", "ELI5"), ("eli10", "ELI10"), ("eli20", "ELI20")]:
            raw = extract_panel(html, level)
            if raw:
                md = html_to_md(raw)
                out_lines.append(f"### {name}")
                out_lines.append("")
                out_lines.append(md)
                out_lines.append("")
            else:
                out_lines.append(f"### {name}")
                out_lines.append("")
                out_lines.append("*No content.*")
                out_lines.append("")

        out_lines.append("---")
        out_lines.append("")

    out_path = ROOT / "ELI-summaries.md"
    out_path.write_text("\n".join(out_lines), encoding="utf-8")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
