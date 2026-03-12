export class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
    this.updateCount();
  }

  add(product) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.save();
    this.updateCount();
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  }

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  updateCount() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
      const totalItems = this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      countEl.textContent = totalItems;
    }
  }

  getItems() {
    return this.items;
  }

  clear() {
    this.items = [];
    this.save();
    this.updateCount();
  }
}