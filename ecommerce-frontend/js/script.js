document.addEventListener('DOMContentLoaded', () => {
    console.log('[Script] Loaded – attaching event listeners');

    // Theme toggle – fully working
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const sun = themeToggle.querySelector('.sun');
            const moon = themeToggle.querySelector('.moon');
            if (sun && moon) {
                sun.classList.toggle('hidden');
                moon.classList.toggle('hidden');
            }
            console.log('Theme toggled to:', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        });
    }

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Search overlay toggle
    const searchBtn = document.getElementById('searchToggleBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');

    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            searchOverlay.classList.toggle('active');
            if (searchOverlay.classList.contains('active')) {
                document.getElementById('searchInput')?.focus();
            }
        });
    }

    if (closeSearch) {
        closeSearch.addEventListener('click', () => {
            searchOverlay?.classList.remove('active');
        });
    }

    // Cart modal toggle
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const continueShopping = document.getElementById('continue-shopping');

    if (cartIcon && cartModal) {
        cartIcon.addEventListener('click', () => {
            cartModal.style.display = 'flex';
            console.log('Cart modal opened');
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
    }

    if (continueShopping) {
        continueShopping.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
    }

    // Backdrop close for cart modal
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }

    // Optional: initial cart count (if you have localStorage logic)
    // updateCartDisplay();  // uncomment if you have this function
});