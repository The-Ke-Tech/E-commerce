// js/main.js
import { Cart } from './cart.js';
import { renderAllProducts, renderFeatured, getAllProducts, fetchAndRenderProducts } from './products.js';
import { showToast } from './utils.js';

// ────────────────────────────────────────────────
// Global cart instance
const myCart = new Cart();

// ────────────────────────────────────────────────
// Refresh cart display (icon count + modal content)
function updateCartDisplay() {
  const cartCountEl     = document.getElementById('cart-count');
  const itemsContainer  = document.getElementById('cart-items');
  const totalEl         = document.getElementById('cart-total');
  const itemCountEl     = document.getElementById('cart-item-count');
  const checkoutBtn     = document.getElementById('checkout-btn');
  const emptyMessage    = document.getElementById('empty-cart-message');

  const items = myCart.getItems();

  // Update floating cart icon count
  if (cartCountEl) {
    const totalQty = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
    cartCountEl.textContent = totalQty || '0';
  }

  if (!itemsContainer) return;

  itemsContainer.innerHTML = '';

  if (items.length === 0) {
    if (emptyMessage) emptyMessage.classList.remove('hidden');
    if (itemCountEl) itemCountEl.textContent = '(0)';
    if (totalEl) totalEl.textContent = '0';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (emptyMessage) emptyMessage.classList.add('hidden');
  if (checkoutBtn) checkoutBtn.disabled = false;

  let grandTotal = 0;

  items.forEach((item, index) => {
    const qty = item.quantity || 1;
    const priceKES = Math.round(item.price * 130);
    const lineTotal = priceKES * qty;
    grandTotal += lineTotal;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.title}</h4>
        <div class="cart-item-price">KSh ${priceKES.toLocaleString()}</div>
      </div>
      <div class="cart-item-controls">
        <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
        <span class="quantity-display">${qty}</span>
        <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
        <button class="remove-btn" data-index="${index}" aria-label="Remove item">🗑</button>
      </div>
    `;
    itemsContainer.appendChild(itemEl);
  });

  if (totalEl) totalEl.textContent = grandTotal.toLocaleString();
  if (itemCountEl) itemCountEl.textContent = `(${items.length})`;
}

// ────────────────────────────────────────────────
// Modal open / close
function showCartModal() {
  console.log('[Cart] showCartModal called');
  const modal = document.getElementById('cart-modal');
  if (!modal) {
    console.error('[Cart] Modal element #cart-modal not found');
    return;
  }

  updateCartDisplay();
  modal.style.display = 'flex';
}

function hideCartModal() {
  const modal = document.getElementById('cart-modal');
  if (modal) modal.style.display = 'none';
}

// ────────────────────────────────────────────────
// Modal navigation (close buttons, checkout, backdrop click)
function attachModalNavigation() {
  const modal = document.getElementById('cart-modal');
  if (!modal) return;

  // All close buttons
  const closeButtons = [
    document.getElementById('close-cart-top'),
    document.getElementById('close-cart-bottom'),
    document.getElementById('continue-shopping-btn')
  ];

  closeButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        hideCartModal();
        console.log('Cart modal closed via button');
      });
    }
  });

  // Checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (checkoutBtn.disabled) {
        alert("Your cart is empty — add some items first!");
        return;
      }

      alert("✅ Proceeding to checkout...\n(This is a mock — real payment coming later)");

      // Optional: clear cart after checkout
      // myCart.clear();
      // updateCartDisplay();

      hideCartModal();
    });
  }

  // Click outside (backdrop) to close
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      hideCartModal();
    }
  });
}

// Expose for loader.js
window.attachModalNavigation = attachModalNavigation;

// ────────────────────────────────────────────────
// Quantity / Remove logic (event delegation)
document.addEventListener('click', function(e) {
  const target = e.target;
  if (!target.closest('.modal-content')) return;

  const index = target.dataset.index;
  if (index === undefined) return;

  const idx = parseInt(index, 10);
  const items = myCart.getItems();

  if (target.dataset.action === 'increase') {
    items[idx].quantity = (items[idx].quantity || 1) + 1;
  } else if (target.dataset.action === 'decrease') {
    if ((items[idx].quantity || 1) > 1) {
      items[idx].quantity -= 1;
    } else {
      items.splice(idx, 1);
    }
  } else if (target.classList.contains('remove-btn')) {
    items.splice(idx, 1);
  }

  myCart.save();
  updateCartDisplay();
});

// ────────────────────────────────────────────────
// Attach cart icon & basic modal listeners (with retry)
function attachCartListeners() {
  console.log('[Cart] Trying to attach listeners...');

  let attached = 0;

  const cartIcon = document.getElementById('cart-icon');
  if (cartIcon) {
    cartIcon.removeEventListener('click', showCartModal);
    cartIcon.addEventListener('click', showCartModal);
    attached++;
    console.log('[Cart] Listener attached to cart-icon');
  }

  // We no longer attach close-btn here — moved to attachModalNavigation()

  if (attached > 0) {
    console.log(`[Cart] ${attached} listener(s) attached successfully`);
  } else {
    console.warn('[Cart] No cart elements found – retrying...');
    setTimeout(attachCartListeners, 400);
  }
}

window.attachCartListeners = attachCartListeners;

// ────────────────────────────────────────────────
// Global add-to-cart
window.addToCart = function (id) {
  const product = getAllProducts().find(p => p.id === id);
  if (!product) return;

  myCart.add(product);
  showToast(`${product.title} added to cart!`);
  updateCartDisplay();
};

// ────────────────────────────────────────────────
// Newsletter
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email')?.value?.trim();
    if (email && email.includes('@') && email.includes('.')) {
      alert('🎉 Thank you for subscribing!');
      form.reset();
    } else {
      alert('Please enter a valid email address');
    }
  });
}

// ────────────────────────────────────────────────
// Page initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Main] Page loaded – initializing');

  myCart.updateCount();
  initNewsletter();

  if (document.getElementById('featured-grid')) {
    fetchAndRenderProducts().then(() => {
      renderFeatured?.();
    });
  }

  if (document.getElementById('products-grid')) {
    fetchAndRenderProducts().then(() => {
      renderAllProducts?.();

      document.getElementById('search-input')?.addEventListener('input', filterProducts);
      document.getElementById('category-filter')?.addEventListener('change', filterProducts);
    });
  }

  attachCartListeners();
});

// Filter function (shop page)
function filterProducts() {
  const search = document.getElementById('search-input')?.value?.toLowerCase() || '';
  const category = document.getElementById('category-filter')?.value || 'All';

  const filtered = getAllProducts().filter(p =>
    p.title.toLowerCase().includes(search) &&
    (category === 'All' || p.category === category)
  );

  renderAllProducts?.(filtered);
}

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const sun = themeToggle.querySelector('.sun');
    const moon = themeToggle.querySelector('.moon');
    sun.classList.toggle('hidden');
    moon.classList.toggle('hidden');
  });
}

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}