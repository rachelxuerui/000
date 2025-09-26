
(() => {
  const container = document.querySelector('.content');
  const tooltip = document.getElementById('tooltip');
  if (!container || !tooltip) return;

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
  // Use mousemove on the container and react only when target is a .cell img
  const H_OFFSET = 12;  // px offset from cursor
  const V_OFFSET = 12;

  // Helper to show/hide tooltip
  const showTooltip = (text, x, y) => {
    tooltip.textContent = text || '';
    tooltip.style.opacity = '1';
    // Tooltip is fixed — use clientX/clientY
    // Optionally clamp so it doesn't go off-screen
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;

    // Pre-measure to clamp within viewport
    tooltip.style.left = '-9999px';
    tooltip.style.top = '-9999px';
    // Force layout to get size
    const { width: tw, height: th } = tooltip.getBoundingClientRect();

    const nx = Math.min(Math.max(x + H_OFFSET, 0), vw - tw - 2);
    const ny = Math.min(Math.max(y + V_OFFSET, 0), vh - th - 2);

    tooltip.style.left = nx + 'px';
    tooltip.style.top  = ny + 'px';
  };

  const hideTooltip = () => {
    tooltip.style.opacity = '0';
  };

  // Track whether we are currently over an image
  let hoveringImg = null;

  container.addEventListener('mousemove', (e) => {
    const img = e.target.closest('.cell img');
    if (img && container.contains(img)) {
      hoveringImg = img;
      // Use dataset name or fallback to alt
      const label = img.dataset.name || img.getAttribute('alt') || '';
      showTooltip(label, e.clientX, e.clientY);
    } else if (hoveringImg) {
      // Moved off any image
      hoveringImg = null;
      hideTooltip();
    }
  }, { passive: true });

  // Also hide when leaving the container entirely
  container.addEventListener('mouseleave', hideTooltip);

  // Optional: add a visual hover class via delegation (covers clones)
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
})();
