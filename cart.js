// cart.js

class CartManager {
    constructor() {
        this.init();
    }

    init() {
        this.updateCartDisplay();
    }

    isLoggedIn() {
        // Use the Auth class method instead of checking currentUser
        return Auth.isAuthenticated();
    }

    async addToCart(product) {
        if (!this.isLoggedIn()) {
            // Store the current URL before redirecting
            localStorage.setItem('redirectUrl', window.location.href);
            window.location.href = 'login.html';
            return;
        }

        try {
            const response = await fetch('https://adora-t8e8.onrender.com/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Auth': Auth.getToken()
                },
                body: JSON.stringify({
                    productId: product._id,
                    qty: 1
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.updateCartDisplay();
                alert('Product added to cart successfully');
            } else {
                alert(data.message || 'Error adding product to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Error adding product to cart');
        }
    }

    async updateCartDisplay() {
        if (!this.isLoggedIn()) return;

        try {
            const response = await fetch('https://adora-t8e8.onrender.com/api/cart/user', {
                headers: {
                    'Auth': Auth.getToken()
                }
            });
            const data = await response.json();

            const cartCount = document.getElementById('cart-count');
            const cartTotal = document.getElementById('cart-total');

            if (data.cart && data.cart.items) {
                const itemCount = data.cart.items.reduce((total, item) => total + item.qty, 0);
                const totalPrice = data.cart.items.reduce((total, item) => total + (item.price * item.qty), 0);

                if (cartCount) cartCount.textContent = itemCount;
                if (cartTotal) cartTotal.textContent = `₹ ${totalPrice.toFixed(2)}`;
            }
        } catch (error) {
            console.error('Error updating cart display:', error);
        }
    }

    async getCartItems() {
        if (!this.isLoggedIn()) return [];

        try {
            const response = await fetch('https://adora-t8e8.onrender.com/api/cart/user', {
                headers: {
                    'Auth': Auth.getToken()
                }
            });
            const data = await response.json();
            return data.cart?.items || [];
        } catch (error) {
            console.error('Error getting cart items:', error);
            return [];
        }
    }
}

// Create global instance
const cartManager = new CartManager();

// Export the cartManager instance if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = cartManager;
}
