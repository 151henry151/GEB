#!/usr/bin/env python3
"""Import ELI5, ELI10, ELI20 content from GEB_Summaries_Rewritten.md into chapter HTML files."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REWRITTEN = Path("/home/henry/GEB_Summaries_Rewritten.md")


def md_paragraph_to_html(para: str) -> str:
    """Convert one markdown paragraph to HTML: **bold**, *italic*, escape <>&."""
    s = para.strip()
    if not s:
        return ""
    s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    # ** before * so we don't break ** with * inside
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"\*(.+?)\*", r"<em>\1</em>", s)
    return "<p>" + s + "</p>"


def md_to_html(body: str) -> str:
    """Convert markdown body (multiple paragraphs, optional ## lines) to HTML."""
    parts = []
    # Split by double newline; treat ## line as subheading, else paragraph
    for block in re.split(r"\n\s*\n", body):
        block = block.strip()
        if not block:
            continue
        if block.startswith("## "):
            line = block[3:].strip()
            line = line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            line = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", line)
            line = re.sub(r"\*(.+?)\*", r"<em>\1</em>", line)
            parts.append("<h2>" + line + "</h2>")
        else:
            parts.append(md_paragraph_to_html(block))
    return "\n          ".join(parts)


def extract_sections(md_path: Path) -> list[tuple[str, str, str]]:
    """Return list of (eli5_body, eli10_body, eli20_body) per section (intro + ch1..ch20)."""
    text = md_path.read_text(encoding="utf-8")
    # Split by ## (section headers); drop first chunk (title + intro)
    chunks = re.split(r"\n## ", text)
    sections = []
    for i, chunk in enumerate(chunks):
        if i == 0:
            continue  # skip "# GEB Companion: Rewritten..."
        chunk = chunk.strip()
        if not chunk or chunk.startswith("---"):
            continue
        # First line is section title; rest is body until next ## (we don't have ## inside a section)
        lines = chunk.split("\n")
        # Split by ### ELI5, ### ELI10, ### ELI20
        rest = "\n".join(lines[1:]) if len(lines) > 1 else ""
        parts = re.split(r"\n### ELI5\s*\n", rest, maxsplit=1, flags=re.IGNORECASE)
        if len(parts) < 2:
            continue
        after_eli5 = parts[1]
        parts10 = re.split(r"\n### ELI10\s*\n", after_eli5, maxsplit=1, flags=re.IGNORECASE)
        if len(parts10) < 2:
            continue
        eli5_body = parts10[0].strip()
        after_eli10 = parts10[1]
        parts20 = re.split(r"\n### ELI20\s*\n", after_eli10, maxsplit=1, flags=re.IGNORECASE)
        if len(parts20) < 2:
            continue
        eli10_body = parts20[0].strip()
        eli20_body = parts20[1].strip()
        sections.append((eli5_body, eli10_body, eli20_body))
    return sections


def update_html_file(html_path: Path, eli5_html: str, eli10_html: str, eli20_html: str) -> None:
    """Replace the three reading panels' content-inner in the HTML file."""
    html = html_path.read_text(encoding="utf-8")

    def replace_panel(panel_id: str, new_content: str) -> str:
        pattern = (
            r'(<div data-reading-panel="'
            + panel_id
            + r'" class="reading-content"[^>]*>\s*<div class="content-inner">).*?(\s*</div>\s*</div>)'
        )
        # Prepend newline so first tag is on its own line
        if new_content and not new_content.startswith("\n"):
            new_content = "\n          " + new_content
        return re.sub(pattern, lambda m: m.group(1) + new_content + m.group(2), html, count=1, flags=re.DOTALL)

    html = replace_panel("eli5", eli5_html)
    html = replace_panel("eli10", eli10_html)
    html = replace_panel("eli20", eli20_html)
    html_path.write_text(html, encoding="utf-8")


def main() -> None:
    if not REWRITTEN.exists():
        print(f"Missing {REWRITTEN}")
        return
    sections = extract_sections(REWRITTEN)
    paths = ["intro"] + [f"chapter-{i:02d}" for i in range(1, 21)]
    if len(sections) != len(paths):
        print(f"Section count {len(sections)} != path count {len(paths)}")
        return
    for (eli5_body, eli10_body, eli20_body), dirname in zip(sections, paths):
        html_path = ROOT / dirname / "index.html"
        if not html_path.exists():
            print(f"Skip (missing): {html_path}")
            continue
        eli5_html = md_to_html(eli5_body)
        eli10_html = md_to_html(eli10_body)
        eli20_html = md_to_html(eli20_body)
        update_html_file(html_path, eli5_html, eli10_html, eli20_html)
        print(f"Updated {html_path}")
    print("Done.")


if __name__ == "__main__":
    main()
