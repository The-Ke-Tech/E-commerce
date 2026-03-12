export function createProductCard(product, addToCartFn) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.innerHTML = `
    <img src="${product.image}" loading="lazy" alt="${product.title}">
    <div class="product-card-content">
      <h3>${product.title}</h3>
      <p class="price">KSh ${(product.price * 130).toFixed(0)}</p>
      <button class="add-btn">Add to Cart</button>
    </div>
  `;
  card.querySelector('.add-btn').onclick = () => addToCartFn(product.id);
  return card;
}

export function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '24px', right: '24px',
    background: '#10b981', color: 'white',
    padding: '1rem 1.4rem', borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    zIndex: '2000'
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}