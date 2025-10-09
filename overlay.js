(() => {
  // =========================
  // Project Overlay
  // =========================
  const overlay = document.getElementById('project-overlay');

  const fadeOutAndNavigate = () => {
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        window.history.back();
      }, 300);
    } else {
      window.history.back();
    }
  };

  // Intercept logo and close button clicks early
  document.addEventListener('mousedown', (e) => {
    if (overlay) {
      const logo = e.target.closest('#logo');
      const close = e.target.closest('#close-overlay');

      if (logo || close) {
        e.preventDefault();
        e.stopImmediatePropagation();
        fadeOutAndNavigate();
      }
    }
  }, true);

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay) {
      fadeOutAndNavigate();
    }
  });
})();
