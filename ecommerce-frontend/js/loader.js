// js/loader.js
document.addEventListener('DOMContentLoaded', async () => {
  const placeholders = [
    { id: 'header-placeholder', file: 'header.html' },
    { id: 'footer-placeholder', file: 'footer.html' },
    { id: 'cart-modal-placeholder', file: 'cart-modal.html' }
  ];

  for (const { id, file } of placeholders) {
    const el = document.getElementById(id);
    if (!el) continue;

    try {
      const response = await fetch(file);
      if (!response.ok) throw new Error(`Failed to load ${file}`);
      const html = await response.text();
      el.innerHTML = html;

      // Special handling after cart modal is loaded
      if (file === 'cart-modal.html') {
        // Attach cart icon / general modal listeners
        if (typeof window.attachCartListeners === 'function') {
          window.attachCartListeners();
        }

        // Attach close buttons, checkout, backdrop click, etc.
        if (typeof window.attachModalNavigation === 'function') {
          window.attachModalNavigation();
        }
      }
    } catch (err) {
      console.error(`Error loading ${file}:`, err);
      el.innerHTML = `<p style="color:red">Error loading ${file}</p>`;
    }
  }
});