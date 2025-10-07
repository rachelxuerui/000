
(() => {
  const container = document.querySelector('.content');
  const tooltip = document.getElementById('tooltip');
  const lines = document.getElementById('lines');
  const logo = document.getElementById('logo')
  if (!container || !tooltip) return;

  // =========================
  // Lines tooltip on click
  // =========================
  let isClickActive = false;

  // Show lines at mouse position
  const showLines = (x, y) => {
    lines.style.opacity = '1';
    const yLine = document.getElementById('y');
    const xLine = document.getElementById('x');
    const zLine = document.getElementById('z');

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Vertical line (y) - from cursor downward
    yLine.style.left = x + 'px';
    yLine.style.top = y + 'px';
    yLine.style.height = (vh - y) + 'px';

    // Horizontal line (x) - from cursor rightward
    xLine.style.left = x + 'px';
    xLine.style.top = y + 'px';
    xLine.style.width = (vw - x) + 'px';

    // Diagonal line (z) - from cursor at 45deg
    const diagonalLength = Math.sqrt(Math.pow(vw - x, 2) + Math.pow(vh - y, 2));
    zLine.style.left = x + 'px';
    zLine.style.top = y + 'px';
    zLine.style.width = diagonalLength + 'px';
  };

  const hideLines = () => {
    lines.style.opacity = '0';
  };

  // Track mouse position during click
  const updateLinesPosition = (e) => {
    if (isClickActive) {
      showLines(e.clientX, e.clientY);
    }
  };

  // Check if element is clickable
  const isClickable = (el) => {
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    return tag === 'a' || tag === 'button' ||
           el.onclick !== null ||
           el.hasAttribute('onclick') ||
           el.closest('a') !== null ||
           el.closest('button') !== null ||
           el.closest('li') !== null ||
           el.classList.contains('cell');
  };

  // Handle mousedown on clickable elements
  document.addEventListener('mousedown', (e) => {
    if (isClickable(e.target)) {
      isClickActive = true;
      hideTooltip(); // Hide tooltip when lines appear
      showLines(e.clientX, e.clientY);
    }
  });

  // Update lines position during drag
  document.addEventListener('mousemove', updateLinesPosition);

  // Handle mouseup to hide lines
  document.addEventListener('mouseup', () => {
    isClickActive = false;
    hideLines();
  });

  // Hide lines if mouse leaves window during click
  document.addEventListener('mouseleave', () => {
    if (isClickActive) {
      hideLines();
    }
  });

  // =========================
  // Infinite downward append
  // =========================
  const templateCells = Array.from(container.children);
  const cloneCells = () => templateCells.map(cell => cell.cloneNode(true));

  const onScroll = () => {
    const scrollBottom = container.scrollTop + container.clientHeight;
    if (scrollBottom >= container.scrollHeight - 10) {
      cloneCells().forEach(clone => container.appendChild(clone));
    }
  };
  container.addEventListener('scroll', onScroll, { passive: true });

  // =========================
  // Delegated hover + tooltip
  // =========================

  // use mousemove on the container and react only when target is a .cell img
  const H_OFFSET = 3;  // px offset from cursor
  const V_OFFSET = 3;

  // helper to show/hide tooltip
  const showTooltip = (content, x, y) => {
  // make visible
  tooltip.style.opacity = '1';

  // clear existing
  tooltip.replaceChildren();

  // insert content
  if (typeof content === 'string') {
    tooltip.innerHTML = content;               // trusted HTML string
  } else if (content instanceof Node) {
    tooltip.appendChild(content.cloneNode(true)); // clone so you don't move the original
  } else {
    tooltip.textContent = String(content ?? '');
  }

  // position (tooltip is position:fixed)
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  tooltip.style.left = '-9999px';
  tooltip.style.top = '-9999px';
  const { width: tw, height: th } = tooltip.getBoundingClientRect();

  const nx = Math.min(Math.max(x + H_OFFSET, 0), vw - tw - 2);
  const ny = Math.min(Math.max(y + V_OFFSET, 0), vh - th - 2);

  tooltip.style.left = nx + 'px';
  tooltip.style.top  = ny + 'px';
};
  const hideTooltip = () => {
    tooltip.style.opacity = '0';
  };

  // track whether we are currently over an image
  let hoveringImg = null;

  container.addEventListener('mousemove', (e) => {
    // Don't show tooltip if click is active (lines are showing)
    if (isClickActive) return;

    const img = e.target.closest('.cell img');
    if (img && container.contains(img)) {
      hoveringImg = img;
      // use dataset name or fallback to alt
      const label = img.dataset.name || img.getAttribute('alt') || '';
      showTooltip(label, e.clientX, e.clientY);
    } else if (hoveringImg) {
      // Moved off any image
      hoveringImg = null;
      hideTooltip();
    }
  }, { passive: true });

  // hide tooltip when cursor leaves container
  container.addEventListener('mouseleave', hideTooltip);

  // add a visual hover class via delegation (covers clones)
  container.addEventListener('mouseover', (e) => {
    const cell = e.target.closest('.cell');
    if (!cell || !container.contains(cell)) return;
    if (!cell.contains(e.relatedTarget)) cell.classList.add('is-hover');
  });
  container.addEventListener('mouseout', (e) => {
    const cell = e.target.closest('.cell');
    if (!cell || !container.contains(cell)) return;
    if (!cell.contains(e.relatedTarget)) cell.classList.remove('is-hover');
  });

  // hiding tooltip during fast scroll / wheel / touch so it never lingers
  const hideOnScroll = () => {
    hoveringImg = null; 
    hideTooltip();
  };
  container.addEventListener('scroll', hideOnScroll, { passive: true });
  container.addEventListener('wheel', hideOnScroll, { passive: true });
  container.addEventListener('touchmove', hideOnScroll, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hideTooltip();
  });
  window.addEventListener('blur', hideTooltip);

})();