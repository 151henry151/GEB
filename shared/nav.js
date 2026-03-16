/**
 * GEB — shared navigation logic
 * Call GEBNav.init() after DOM ready to inject footer and wire reading switcher.
 */
(function () {
  'use strict';

  var CHAPTERS = [
    { id: 'intro', num: '', title: 'Introduction: A Musico-Logical Offering', path: '/intro/', pdfPage: 10 },
    { id: 'ch01', num: 'I', title: 'The MU-puzzle', path: '/chapter-01/', pdfPage: 41 },
    { id: 'ch02', num: 'II', title: 'Meaning and Form in Mathematics', path: '/chapter-02/', pdfPage: 54 },
    { id: 'ch03', num: 'III', title: 'Figure and Ground', path: '/chapter-03/', pdfPage: 72 },
    { id: 'ch04', num: 'IV', title: 'Consistency, Completeness, and Geometry', path: '/chapter-04/', pdfPage: 90 },
    { id: 'ch05', num: 'V', title: 'Recursive Structures and Processes', path: '/chapter-05/', pdfPage: 135 },
    { id: 'ch06', num: 'VI', title: 'The Location of Meaning', path: '/chapter-06/', pdfPage: 166 },
    { id: 'ch07', num: 'VII', title: 'The Propositional Calculus', path: '/chapter-07/', pdfPage: 189 },
    { id: 'ch08', num: 'VIII', title: 'Typographical Number Theory', path: '/chapter-08/', pdfPage: 212 },
    { id: 'ch09', num: 'IX', title: 'Mumon and Gödel', path: '/chapter-09/', pdfPage: 254 },
    { id: 'ch10', num: 'X', title: 'Levels of Description, and Computer Systems', path: '/chapter-10/', pdfPage: 291 },
    { id: 'ch11', num: 'XI', title: 'Brains and Thoughts', path: '/chapter-11/', pdfPage: 343 },
    { id: 'ch12', num: 'XII', title: 'Minds and Thoughts', path: '/chapter-12/', pdfPage: 375 },
    { id: 'ch13', num: 'XIII', title: 'BlooP and FlooP and GlooP', path: '/chapter-13/', pdfPage: 412 },
    { id: 'ch14', num: 'XIV', title: 'On Formally Undecidable Propositions', path: '/chapter-14/', pdfPage: 444 },
    { id: 'ch15', num: 'XV', title: 'Jumping out of the System', path: '/chapter-15/', pdfPage: 471 },
    { id: 'ch16', num: 'XVI', title: 'Self-Ref and Self-Rep', path: '/chapter-16/', pdfPage: 502 },
    { id: 'ch17', num: 'XVII', title: 'Church, Turing, Tarski, and Others', path: '/chapter-17/', pdfPage: 565 },
    { id: 'ch18', num: 'XVIII', title: 'Artificial Intelligence: Retrospects', path: '/chapter-18/', pdfPage: 600 },
    { id: 'ch19', num: 'XIX', title: 'Artificial Intelligence: Prospects', path: '/chapter-19/', pdfPage: 647 },
    { id: 'ch20', num: 'XX', title: 'Strange Loops, Or Tangled Hierarchies', path: '/chapter-20/', pdfPage: 690 }
  ];

  function base() {
    var p = window.location.pathname.replace(/\/$/, '');
    var parts = p.split('/').filter(Boolean);
    if (parts.length === 0) return '';
    return parts.slice(0, -1).reduce(function (acc, seg) { return acc + '/' + seg; }, '') || '';
  }

  function resolve(path) {
    if (path.startsWith('http')) return path;
    var b = base();
    if (path.startsWith('/')) return path;
    return (b ? b + '/' : '') + path;
  }

  function currentChapterIndex() {
    var path = window.location.pathname.replace(/\/$/, '');
    var seg = path.split('/').filter(Boolean).pop() || '';
    for (var i = 0; i < CHAPTERS.length; i++) {
      var p = CHAPTERS[i].path.replace(/^\//, '').replace(/\/$/, '');
      if (seg === p || path.endsWith('/' + p) || path === p) return i;
    }
    return -1;
  }

  function renderFooter() {
    var root = document.getElementById('geb-footer-root');
    if (!root) return;
    var idx = currentChapterIndex();
    var homeLink = idx < 0 ? 'index.html' : '../index.html';
    root.innerHTML =
      '<footer class="site-footer">' +
      '<p><strong>Gödel, Escher, Bach: An Eternal Golden Braid</strong> by Douglas R. Hofstadter</p>' +
      '<p><a href="' + homeLink + '">← All chapters</a> · <a href="https://hromp.com/geb/">hromp.com/geb</a></p>' +
      '<p class="footer-note">Built with care.</p>' +
      '</footer>';
  }

  function renderChapterNav(prevNextRoot) {
    if (!prevNextRoot) return;
    var idx = currentChapterIndex();
    if (idx < 0) return;
    var prev = idx > 0 ? CHAPTERS[idx - 1] : null;
    var next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null;
    var up = '../';
    var html = '';
    if (prev) html += '<a href="' + up + prev.path.replace(/^\//, '') + '">← Previous: ' + (prev.num ? 'Ch. ' + prev.num : 'Introduction') + '</a>';
    else html += '<span></span>';
    if (next) html += '<a href="' + up + next.path.replace(/^\//, '') + '">Next: ' + (next.num ? 'Ch. ' + next.num : 'Introduction') + ' →</a>';
    else html += '<span></span>';
    prevNextRoot.innerHTML = html;
  }

  function wireReadingSwitcher() {
    var container = document.getElementById('reading-switcher');
    if (!container) return;
    var tabs = container.querySelectorAll('[data-reading]');
    var panels = document.querySelectorAll('[data-reading-panel]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var level = tab.getAttribute('data-reading');
        tabs.forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
        panels.forEach(function (p) {
          p.classList.toggle('on', p.getAttribute('data-reading-panel') === level);
        });
        try { localStorage.setItem('geb-reading-level', level); } catch (e) {}
      });
    });
    var saved = '';
    try { saved = localStorage.getItem('geb-reading-level'); } catch (e) {}
    if (saved) {
      var t = container.querySelector('[data-reading="' + saved + '"]');
      if (t) t.click();
    }
  }

  window.GEBNav = {
    CHAPTERS: CHAPTERS,
    resolve: resolve,
    currentChapterIndex: currentChapterIndex,
    init: function () {
      renderFooter();
      renderChapterNav(document.getElementById('geb-prev-next'));
      wireReadingSwitcher();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.GEBNav.init);
  } else {
    window.GEBNav.init();
  }
})();
