import { createProductCard } from './utils.js';

let allProducts = [];

export async function fetchAndRenderProducts() {
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'block';

  try {
    const res = await fetch('https://fakestoreapi.com/products');
    allProducts = await res.json();

    renderFeatured();
    renderAllProducts();
    populateCategories();
  } catch (err) {
    console.error(err);
    alert("Failed to load products. Check connection.");
  } finally {
    if (loading) loading.style.display = 'none';
  }

  return allProducts;
}

function renderFeatured() {
  const container = document.getElementById('featured-grid');
  if (!container) return;
  container.innerHTML = '';
  allProducts.slice(0, 6).forEach(p => {
    container.appendChild(createProductCard(p, addToCart));
  });
}

export function renderAllProducts(filtered = allProducts) {
  const container = document.getElementById('products-grid');
  if (!container) return;
  container.innerHTML = '';
  filtered.forEach(p => {
    container.appendChild(createProductCard(p, addToCart));
  });
}

function populateCategories() {
  const select = document.getElementById('category-filter');
  if (!select) return;
  const categories = [...new Set(allProducts.map(p => p.category))];
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    select.appendChild(opt);
  });
}

export function getAllProducts() {
  return allProducts;
}