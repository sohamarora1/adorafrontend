// Fetch and Display Products
async function fetchProducts() {
    try {
        const response = await fetch('https://adora-t8e8.onrender.com/api/product/all');
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <img src="${product.imgSrc}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">₹${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <button class="btn-add-to-cart" data-product-id="${product._id}">Add to Cart</button>
            </div>
        </div>
    `;
}

function displayProducts(products, category, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    products.forEach(product => {
        if (product.category === 'mensection' && product.type === category) {
            const productCard = createProductCard(product);
            container.innerHTML += productCard;
        }
    });
}

// Add Product to Cart
function addToCart(product) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login first to add items to cart');
        localStorage.setItem('returnTo', window.location.href);
        window.location.href = 'login.html';
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item._id === product._id);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    alert('Product added to cart successfully');
}

// Update Cart Display
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    const itemCount = cart.reduce((total, item) => total + item.qty, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.qty), 0);

    if (cartCount) cartCount.textContent = itemCount;
    if (cartTotal) cartTotal.textContent = `₹ ${totalPrice.toFixed(2)}`;
}

// Clear Cart on Logout
function clearCartOnLogout() {
    localStorage.removeItem('cart');
    updateCartDisplay();
}

// Save and Restore Cart with Backend (Optional)
async function saveCartToBackend(cart) {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            await fetch('https://adora-t8e8.onrender.com/api/cart/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cart })
            });
        } catch (error) {
            console.error('Error saving cart to backend:', error);
        }
    }
}

async function restoreCartOnLogin() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch('https://adora-t8e8.onrender.com/api/cart/get', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.cart) {
                localStorage.setItem('cart', JSON.stringify(data.cart));
            }
        } catch (error) {
            console.error('Error restoring cart:', error);
        }
    }
    updateCartDisplay();
}

// Authentication and Authorization Checks
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const profileInitial = document.getElementById('profileInitial');

    if (token) {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData.name) {
            profileInitial.textContent = userData.name.charAt(0).toUpperCase();
            profileInitial.style.display = 'flex';
        }
    } else {
        profileInitial.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication status
    checkAuthStatus();

    // Restore cart on login
    restoreCartOnLogin();

    // Fetch and display products for specific pages
    const products = await fetchProducts();
    displayProducts(products, 'formals', '#college-outfits .product-grid'); // Example for formals
    displayProducts(products, 'festives', '#trendy-outfits .product-grid'); // Example for festives
    displayProducts(products, 'casuals', '#casual-outfits .product-grid'); // Example for casuals

    // Initialize cart display
    updateCartDisplay();

    // Handle add-to-cart button clicks
    document.addEventListener('click', async function (e) {
        if (e.target && e.target.classList.contains('btn-add-to-cart')) {
            const productId = e.target.getAttribute('data-product-id');
            const product = products.find(p => p._id === productId);
            if (product) {
                addToCart(product);
                await saveCartToBackend(JSON.parse(localStorage.getItem('cart')));
            }
        }
    });

    // Handle cart button click
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function () {
            window.location.href = 'cart.html'; // Redirect to cart page
        });
    }

    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            clearCartOnLogout();
            window.location.href = 'login.html';
        });
    }
});
