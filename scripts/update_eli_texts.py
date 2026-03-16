#!/usr/bin/env python3
"""Update ELI5/ELI10/ELI20 panels in GEB chapter HTML files for consistent length and clarity."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def find_panel_end(s, start):
    """Find end of a reading-panel div (next sibling div at same level)."""
    depth = 0
    i = start
    in_div = False
    while i < len(s):
        if s[i:i+4] == '<div':
            j = i + 4
            while j < len(s) and s[j] in ' \t\n':
                j += 1
            if s[j:j+7] == 'data-re':
                in_div = True
                depth += 1
            elif in_div:
                depth += 1
            i = j
            continue
        if in_div and s[i:i+6] == '</div>':
            depth -= 1
            if depth == 0:
                return i + 6
            i += 6
            continue
        i += 1
    return -1

def replace_between(s, start_marker, end_marker, new_content):
    """Replace content between start_marker and end_marker (exclusive of end)."""
    i = s.find(start_marker)
    if i == -1:
        return s, False
    j = s.find(end_marker, i)
    if j == -1:
        return s, False
    return s[:i] + new_content + s[j:], True

def update_file(path, eli5, eli10, eli20):
    with open(path, 'r', encoding='utf-8') as f:
        s = f.read()
    # Find eli5 panel start
    p5_start = s.find('<div data-reading-panel="eli5"')
    if p5_start == -1:
        return False
    # Find full panel start
    p_full = s.find('<div data-reading-panel="full"')
    if p_full == -1:
        return False
    new_panels = eli5 + '\n' + eli10 + '\n' + eli20 + '\n      '
    new_s = s[:p5_start] + new_panels + s[p_full:]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_s)
    return True

# Chapter 5
ch05_eli5 = '''      <div data-reading-panel="eli5" class="reading-content">
        <div class="content-inner">
          <p>Something is recursive when it has smaller copies of itself inside it. A tree has branches that look like little trees. The same pattern repeats, smaller and smaller. That's recursion.</p>
        </div>
      </div>'''

ch05_eli10 = '''      <div data-reading-panel="eli10" class="reading-content">
        <div class="content-inner">
          <h2>What is recursion?</h2>
          <p>Recursion is when something is defined or built using a "smaller" version of itself. You need a base case—when to stop—and a rule that says how to build the next step from the previous one. For example: a list is either empty, or one item plus a list. So "list" is defined in terms of "list."</p>
          <h2>Recursion everywhere</h2>
          <p>You see it in music: a theme that repeats inside itself, like a tune that contains a smaller copy of the tune. In language: "the cat that the dog chased" has a clause inside a clause. In pictures: fractals are shapes that look the same when you zoom in. In computer programs: a function that calls itself. In every case, the same pattern appears at different levels or sizes.</p>
          <h2>Why it matters for this book</h2>
          <p>Recursion lets a small set of rules describe or generate huge—even infinite—complexity. The formal systems we use (like the one for arithmetic, TNT) rely on recursive definitions. So does Gödel's construction: a sentence that talks about itself. So recursion isn't just a curiosity; it's at the heart of how form and meaning work in the book.</p>
        </div>
      </div>'''

ch05_eli20 = '''      <div data-reading-panel="eli20" class="reading-content">
        <div class="content-inner">
          <h2>Recursive structures and processes</h2>
          <p>Hofstadter presents recursion in multiple contexts: musical patterns (canons, themes that embed themselves at different pitches or times), linguistic structures (embedded clauses, so that a sentence can contain another sentence), geometric fractals (shapes that look the same at every scale), mathematical definitions (e.g. factorial, Fibonacci, defined in terms of smaller cases), and computer programs (functions that call themselves). In each case, the same structure or process appears at multiple levels, with a base case that terminates the recursion so we don't go on forever.</p>
          <h2>Self-similarity and generative power</h2>
          <p>Recursion provides a way to generate arbitrarily complex structures from a finite specification. A small set of rules can produce infinitely many results. That's essential for formal systems: a few axioms and inference rules generate infinitely many theorems. The chapter shows that recursion is not just a technical trick but a pervasive pattern in music, language, and logic. It prepares the reader for recursive definitions in TNT (terms and formulas built from smaller terms and formulas) and for the self-referential constructions that Gödel will use—where a formula effectively refers to itself by encoding its own structure.</p>
        </div>
      </div>'''

if __name__ == '__main__':
    ok = update_file(ROOT / 'chapter-05' / 'index.html', ch05_eli5, ch05_eli10, ch05_eli20)
    print('Chapter 5:', 'OK' if ok else 'FAIL')
