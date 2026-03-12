// js/products.js

let allProducts = [];

// Helper to create a single product card (used by both featured & full list)
function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.innerHTML = `
    <img src="${product.image}" loading="lazy" alt="${product.title}">
    <div class="product-card-content">
      <h3>${product.title}</h3>
      <p class="price">KSh ${(product.price * 130).toFixed(0)}</p>
      <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
    </div>
  `;
  return card;
}

export async function fetchAndRenderProducts() {
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'block';

  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) throw new Error('Network response was not ok');
    
    allProducts = await response.json();

    // Render whatever is present on current page
    if (document.getElementById('featured-grid')) {
      renderFeatured();
    }
    if (document.getElementById('products-grid')) {
      renderAllProducts();
      populateCategories();
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    alert('Failed to load products. Please check your connection.');
  } finally {
    if (loading) loading.style.display = 'none';
  }
}

export function renderFeatured() {
  const container = document.getElementById('featured-grid');
  if (!container) return;
  container.innerHTML = '';
  // Show first 6 as featured
  allProducts.slice(0, 6).forEach(product => {
    container.appendChild(createProductCard(product));
  });
}

export function renderAllProducts(filteredProducts = allProducts) {
  const container = document.getElementById('products-grid');
  if (!container) return;
  container.innerHTML = '';
  filteredProducts.forEach(product => {
    container.appendChild(createProductCard(product));
  });
}

function populateCategories() {
  const select = document.getElementById('category-filter');
  if (!select) return;

  // Clear existing options except "All"
  select.innerHTML = '<option value="All">All Categories</option>';

  const categories = [...new Set(allProducts.map(p => p.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    select.appendChild(option);
  });
}

export function getAllProducts() {
  return allProducts;
}