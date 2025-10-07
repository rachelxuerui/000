(() => {
  const container = document.querySelector('.content');
  const tooltip = document.getElementById('tooltip');
  const lines = document.getElementById('lines');
  if (!container || !tooltip) return;

  // =========================
  // Lines on click
  // =========================
  let isClickActive = false;

  const showLines = (x, y) => {
    lines.style.opacity = '1';
    const yLine = document.getElementById('y');
    const xLine = document.getElementById('x');
    const zLine = document.getElementById('z');
    const vh = window.innerHeight;

    // Y axis - vertical line going down
    yLine.style.left = x + 'px';
    yLine.style.top = y + 'px';
    yLine.style.height = (vh - y) + 'px';

    // X axis - horizontal line going right
    xLine.style.left = x + 'px';
    xLine.style.top = y + 'px';
    xLine.style.width = (vh - y) + 'px';

    // Z axis - diagonal line going bottom-left at -45deg
    zLine.style.left = x + 'px';
    zLine.style.top = y + 'px';
    zLine.style.width = (vh - y) + 'px';
  };

  const hideLines = () => {
    lines.style.opacity = '0';
  };

  const isClickable = (el) => {
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    return tag === 'a' || tag === 'button' || el.onclick !== null ||
           el.hasAttribute('onclick') || el.closest('a, button, li') ||
           el.classList.contains('cell');
  };

  document.addEventListener('click', (e) => {
    if (isClickable(e.target)) {
      const link = e.target.closest('a');
      if (link && link.href) {
        e.preventDefault();

        // Show lines briefly before navigating
        isClickActive = true;
        hideTooltip();
        showLines(e.clientX, e.clientY);

        setTimeout(() => {
          window.location.href = link.href;
        }, 10);
      }
    }
  });

  document.addEventListener('mousedown', (e) => {
    if (isClickable(e.target)) {
      // Skip if it's a link (handled by click event)
      if (e.target.closest('a')) return;

      isClickActive = true;
      hideTooltip();
      showLines(e.clientX, e.clientY);
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isClickActive) showLines(e.clientX, e.clientY);
  });

  document.addEventListener('mouseup', () => {
    isClickActive = false;
    hideLines();
  });

  document.addEventListener('mouseleave', () => {
    if (isClickActive) hideLines();
  });

  // =========================
  // Infinite scroll
  // =========================
  const templateCells = Array.from(container.children);
  const cloneCells = () => templateCells.map(cell => cell.cloneNode(true));

  container.addEventListener('scroll', () => {
    const scrollBottom = container.scrollTop + container.clientHeight;
    if (scrollBottom >= container.scrollHeight - 10) {
      cloneCells().forEach(clone => container.appendChild(clone));
    }
  }, { passive: true });

  // =========================
  // Tooltip on hover
  // =========================
  const H_OFFSET = 3;
  const V_OFFSET = 3;
  let hoveringImg = null;

  const showTooltip = (content, x, y) => {
    tooltip.style.opacity = '1';
    tooltip.replaceChildren();

    if (typeof content === 'string') {
      tooltip.innerHTML = content;
    } else if (content instanceof Node) {
      tooltip.appendChild(content.cloneNode(true));
    } else {
      tooltip.textContent = String(content ?? '');
    }

    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;

    tooltip.style.left = '-9999px';
    tooltip.style.top = '-9999px';
    const { width: tw, height: th } = tooltip.getBoundingClientRect();

    const nx = Math.min(Math.max(x + H_OFFSET, 0), vw - tw - 2);
    const ny = Math.min(Math.max(y + V_OFFSET, 0), vh - th - 2);

    tooltip.style.left = nx + 'px';
    tooltip.style.top = ny + 'px';
  };

  const hideTooltip = () => {
    tooltip.style.opacity = '0';
  };

  container.addEventListener('mousemove', (e) => {
    if (isClickActive) return;

    const img = e.target.closest('.cell img');
    if (img && container.contains(img)) {
      hoveringImg = img;
      const label = img.dataset.name || img.getAttribute('alt') || '';
      showTooltip(label, e.clientX, e.clientY);
    } else if (hoveringImg) {
      hoveringImg = null;
      hideTooltip();
    }
  }, { passive: true });

  container.addEventListener('mouseleave', hideTooltip);

  // Hover class for cells
  container.addEventListener('mouseover', (e) => {
    const cell = e.target.closest('.cell');
    if (cell && container.contains(cell) && !cell.contains(e.relatedTarget)) {
      cell.classList.add('is-hover');
    }
  });

  container.addEventListener('mouseout', (e) => {
    const cell = e.target.closest('.cell');
    if (cell && container.contains(cell) && !cell.contains(e.relatedTarget)) {
      cell.classList.remove('is-hover');
    }
  });

  // Hide tooltip on scroll/wheel/touch
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
