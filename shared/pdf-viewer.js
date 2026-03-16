/**
 * GEB PDF viewer — render chapter PDFs with PDF.js so they work on all devices
 * (including Chrome on Android where iframe PDF often fails).
 */
(function () {
  'use strict';

  var PDFJS_CDN = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/legacy/build/';
  var pdfjsLib = typeof globalThis !== 'undefined' && globalThis.pdfjsLib;

  if (!pdfjsLib) {
    initFallbackOnly();
    return;
  }

  pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_CDN + 'pdf.worker.min.js';

  function resolvePdfUrl(relativeSrc) {
    return new URL(relativeSrc, window.location.href).href;
  }

  function initFallbackOnly() {
    var container = document.querySelector('.pdf-viewer-container');
    if (!container || container.getAttribute('data-pdf-src') === null) return;
    var src = container.getAttribute('data-pdf-src');
    var url = resolvePdfUrl(src);
    container.innerHTML = '<p class="pdf-viewer-fallback">PDF viewer could not load. <a href="' + escapeAttr(url) + '" target="_blank" rel="noopener noreferrer">Open this chapter’s PDF in a new tab</a>.</p>';
  }

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  function initViewer(container) {
    var pdfSrc = container.getAttribute('data-pdf-src');
    if (!pdfSrc) return;
    var pdfUrl = resolvePdfUrl(pdfSrc);

    var toolbar = document.createElement('div');
    toolbar.className = 'pdf-viewer-toolbar';
    var prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'btn btn-secondary pdf-viewer-prev';
    prevBtn.setAttribute('aria-label', 'Previous page');
    prevBtn.textContent = '← Prev';
    var pageInfo = document.createElement('span');
    pageInfo.className = 'pdf-viewer-page-info';
    pageInfo.innerHTML = 'Page <span class="pdf-viewer-current">1</span> of <span class="pdf-viewer-total">—</span>';
    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'btn btn-secondary pdf-viewer-next';
    nextBtn.setAttribute('aria-label', 'Next page');
    nextBtn.textContent = 'Next →';
    toolbar.appendChild(prevBtn);
    toolbar.appendChild(pageInfo);
    toolbar.appendChild(nextBtn);

    var wrap = document.createElement('div');
    wrap.className = 'pdf-viewer-canvas-wrap';
    var canvas = document.createElement('canvas');
    canvas.className = 'pdf-viewer-canvas';
    wrap.appendChild(canvas);

    var fallbackP = document.createElement('p');
    fallbackP.className = 'pdf-viewer-fallback';
    fallbackP.style.display = 'none';

    container.appendChild(toolbar);
    container.appendChild(wrap);
    container.appendChild(fallbackP);

    var state = { doc: null, numPages: 0, currentPage: 1 };
    var currentSpan = pageInfo.querySelector('.pdf-viewer-current');
    var totalSpan = pageInfo.querySelector('.pdf-viewer-total');

    function showFallback(msg) {
      fallbackP.style.display = 'block';
      fallbackP.innerHTML = (msg || 'PDF failed to load.') + ' <a href="' + escapeAttr(pdfUrl) + '" target="_blank" rel="noopener noreferrer">Open this chapter’s PDF in a new tab</a>.';
      toolbar.style.display = 'none';
      wrap.style.display = 'none';
    }

    function renderPage(pageNum) {
      if (!state.doc || pageNum < 1 || pageNum > state.numPages) return;
      state.currentPage = pageNum;
      state.doc.getPage(pageNum).then(function (page) {
        var baseViewport = page.getViewport({ scale: 1 });
        var containerWidth = wrap.clientWidth || Math.min(800, window.innerWidth - 40);
        var scaleToFit = containerWidth / baseViewport.width;
        var dpr = window.devicePixelRatio || 1;
        var scale = Math.min(2, Math.max(scaleToFit, 0.5) * dpr);
        var viewport = page.getViewport({ scale: scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.maxWidth = '100%';
        var ctx = canvas.getContext('2d');
        var renderCtx = { canvasContext: ctx, viewport: viewport };
        page.render(renderCtx);
      }).catch(function () {
        showFallback();
      });
      currentSpan.textContent = pageNum;
      totalSpan.textContent = state.numPages;
      prevBtn.disabled = pageNum <= 1;
      nextBtn.disabled = pageNum >= state.numPages;
    }

    prevBtn.addEventListener('click', function () {
      if (state.currentPage > 1) renderPage(state.currentPage - 1);
    });
    nextBtn.addEventListener('click', function () {
      if (state.currentPage < state.numPages) renderPage(state.currentPage + 1);
    });

    pdfjsLib.getDocument({ url: pdfUrl }).promise
      .then(function (doc) {
        state.doc = doc;
        state.numPages = doc.numPages;
        totalSpan.textContent = state.numPages;
        renderPage(1);
      })
      .catch(function () {
        showFallback();
      });
  }

  function run() {
    var containers = document.querySelectorAll('.pdf-viewer-container');
    containers.forEach(initViewer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
