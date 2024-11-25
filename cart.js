// cart.js

class CartManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Get current user from localStorage and check if they're logged in
        const userStr = localStorage.getItem('currentUser');
        const token = localStorage.getItem('token'); // Also check for token

        if (userStr && token) {
            try {
                this.currentUser = JSON.parse(userStr);
                this.updateCartDisplay();
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.currentUser = null;
            }
        }
    }

    isLoggedIn() {
        return !!(this.currentUser && localStorage.getItem('token'));
    }

    addToCart(product) {
        if (!this.isLoggedIn()) {
            alert('Please login to add items to cart');
            window.location.href = 'login.html';
            return;
        }

        try {
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
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Error adding product to cart');
        }
    }

    updateCartDisplay() {
        if (!this.isLoggedIn()) return;

        try {
            const userCarts = JSON.parse(localStorage.getItem('userCarts')) || {};
            const userCart = userCarts[this.currentUser.email] || [];

            const cartCount = document.getElementById('cart-count');
            const cartTotal = document.getElementById('cart-total');

            const itemCount = userCart.reduce((total, item) => total + item.qty, 0);
            const totalPrice = userCart.reduce((total, item) => total + (item.price * item.qty), 0);

            if (cartCount) cartCount.textContent = itemCount;
            if (cartTotal) cartTotal.textContent = `₹ ${totalPrice.toFixed(2)}`;
        } catch (error) {
            console.error('Error updating cart display:', error);
        }
    }

    // Add method to get cart items
    getCartItems() {
        if (!this.isLoggedIn()) return [];
        
        const userCarts = JSON.parse(localStorage.getItem('userCarts')) || {};
        return userCarts[this.currentUser.email] || [];
    }
}

// Create global instance
const cartManager = new CartManager();

// Export the cartManager instance if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = cartManager;
}
