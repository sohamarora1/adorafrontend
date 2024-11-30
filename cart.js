async function syncLocalCartToBackend() {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Please log in to sync your cart.');
        return;
    }

    try {
        for (const item of localCart) {
            await fetch('https://adora-t8e8.onrender.com/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Auth': token,
                },
                body: JSON.stringify({ productId: item.id, qty: item.qty }),
            });
        }

        // Clear the local cart after syncing
        localStorage.removeItem('cart');
    } catch (error) {
        console.error('Error syncing cart:', error);
    }
}

async function fetchUserCart() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('https://adora-t8e8.onrender.com/api/cart/user', {
            method: 'GET',
            headers: {
                'Auth': token,
            },
        });

        const data = await response.json();
        return data.cart.items;
    } catch (error) {
        console.error('Error fetching user cart:', error);
        return [];
    }
}

function renderCartItems(items) {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    items.forEach(item => {
        const cartItem = `
            <div class="cart-item">
                <img src="${item.imgSrc}" alt="${item.title}" />
                <h3>${item.title}</h3>
                <p>₹${item.price.toFixed(2)}</p>
                <p>Quantity: ${item.qty}</p>
            </div>
        `;
        cartItemsContainer.innerHTML += cartItem;
        totalPrice += item.price * item.qty;
    });

    totalPriceElement.textContent = totalPrice.toFixed(2);
}

async function initCartPage() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Please log in to access your cart.');
        window.location.href = 'login.html';
        return;
    }

    // Sync local cart to backend
    await syncLocalCartToBackend();

    // Fetch user-specific cart and render it
    const userCart = await fetchUserCart();
    renderCartItems(userCart);
}

window.addEventListener('DOMContentLoaded', initCartPage);
