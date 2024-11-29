const cartContainer = document.querySelector('.cart-container');
const cartItems = document.querySelector('.cart-items');
const totalPriceElement = document.querySelector('#total-price');
const checkoutBtn = document.querySelector('#checkout-btn');

async function fetchCartData() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://adora-t8e8.onrender.com/api/cart/user', {
            method: 'GET',
            headers: {
                'Auth': token,
            },
        });
        const data = await response.json();
        return data.cart.items;
    } catch (error) {
        console.error('Error fetching cart data:', error);
        return [];
    }
}

function renderCartItems(items) {
    const cartItemsHtml = items.map(item => `
        <div class="cart-item">
            <img src="${item.imgSrc}" alt="${item.title}">
            <div class="cart-item-info">
                <h3>${item.title}</h3>
                <p>₹${item.price.toFixed(2)}</p>
                <p>Quantity: ${item.qty}</p>
                <button class="remove-from-cart" data-product-id="${item.productId}">Remove</button>
            </div>
        </div>
    `).join('');
    cartItems.innerHTML = cartItemsHtml;
}

function updateCartSummary(items) {
    const totalPrice = items.reduce((acc, item) => acc + item.price * item.qty, 0);
    totalPriceElement.textContent = totalPrice.toFixed(2);
}

async function handleRemoveFromCart(productId) {
    const token = localStorage.getItem('token');
    try {
        await fetch(`https://adora-t8e8.onrender.com/api/cart/remove/${productId}`, {
            method: 'DELETE',
            headers: {
                'Auth': token,
            },
        });
        loadCartData(); // Refresh cart after removing item
    } catch (error) {
        console.error('Error removing item from cart:', error);
    }
}

async function handleCheckout() {
    const token = localStorage.getItem('token');
    // Implement checkout logic here, such as contacting the backend to process the order
}

async function loadCartData() {
    const items = await fetchCartData();
    renderCartItems(items);
    updateCartSummary(items);
}

window.addEventListener('DOMContentLoaded', () => {
    loadCartData();
    cartItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart')) {
            const productId = e.target.getAttribute('data-product-id');
            handleRemoveFromCart(productId);
        }
    });
    checkoutBtn.addEventListener('click', handleCheckout);
});
