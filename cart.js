// cart.js

class CartManager {
    constructor() {
        this.currentUser = null;
    }

    // Initialize cart manager with user
    init() {
        // Get current user from localStorage
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            this.currentUser = JSON.parse(userStr);
            this.updateCartDisplay();
        }
    }

    // Add item to cart
    addToCart(product) {
        if (!this.currentUser) {
            alert('Please login to add items to cart');
            window.location.href = 'login.html';
            return;
        }

        // Get user's cart from localStorage
        let userCarts = JSON.parse(localStorage.getItem('userCarts')) || {};
        let userCart = userCarts[this.currentUser.email] || [];

        // Check if item already exists
        const existingItem = userCart.find(item => item._id === product._id);

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            userCart.push({ ...product, qty: 1 });
        }

        // Save updated cart
        userCarts[this.currentUser.email] = userCart;
        localStorage.setItem('userCarts', JSON.stringify(userCarts));
        
        this.updateCartDisplay();
        alert('Product added to cart successfully');
    }

    // Update cart display
    updateCartDisplay() {
        if (!this.currentUser) return;

        const userCarts = JSON.parse(localStorage.getItem('userCarts')) || {};
        const userCart = userCarts[this.currentUser.email] || [];

        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');

        const itemCount = userCart.reduce((total, item) => total + item.qty, 0);
        const totalPrice = userCart.reduce((total, item) => total + (item.price * item.qty), 0);

        if (cartCount) cartCount.textContent = itemCount;
        if (cartTotal) cartTotal.textContent = `₹ ${totalPrice.toFixed(2)}`;
    }
}

// Create global instance
const cartManager = new CartManager();
window.addEventListener('load', () => cartManager.init());
