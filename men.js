// men.js

// Utility function for API calls
async function apiCall(endpoint, options = {}) {
    const BASE_URL = 'https://adora-t8e8.onrender.com/api';
    const token = Auth.getToken();

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Auth': token || ''
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}

// Fetch products from the API
async function fetchProducts() {
    try {
        const data = await apiCall('/product/all');
        if (data.products && Array.isArray(data.products)) {
            return data.products;
        }
        console.error('Invalid products data:', data);
        return [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" data-product-id="${product._id}">
            <img src="${product.imgSrc}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">₹${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <button class="btn-add-to-cart" onclick="handleAddToCart('${product._id}')">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Display products in their respective sections
function displayProducts(products) {
    const formalsSection = document.querySelector('#college-outfits .product-grid');
    const festiveSection = document.querySelector('#trendy-outfits .product-grid');
    const casualSection = document.querySelector('#casual-outfits .product-grid');

    // Clear existing content
    if (formalsSection) formalsSection.innerHTML = '';
    if (festiveSection) festiveSection.innerHTML = '';
    if (casualSection) casualSection.innerHTML = '';

    let productsDisplayed = false;

    products.forEach(product => {
        if (product.category === 'mensection') {
            productsDisplayed = true;
            const productCard = createProductCard(product);
            switch (product.type.toLowerCase()) {
                case 'formals':
                    if (formalsSection) formalsSection.innerHTML += productCard;
                    break;
                case 'festiveoutfits':
                    if (festiveSection) festiveSection.innerHTML += productCard;
                    break;
                case 'casualwear':
                    if (casualSection) casualSection.innerHTML += productCard;
                    break;
            }
        }
    });

    if (!productsDisplayed) {
        console.log('No products found for mensection category');
    }
}

// Handle add to cart
async function handleAddToCart(productId) {
    if (!Auth.isAuthenticated()) {
        localStorage.setItem('redirectUrl', window.location.href);
        window.location.href = 'login.html';
        return;
    }

    try {
        // First fetch the product details
        const productData = await apiCall(`/product/${productId}`);
        
        if (!productData.product) {
            throw new Error('Product not found');
        }

        // Add to cart
        const cartData = await apiCall('/cart/add', {
            method: 'POST',
            body: JSON.stringify({
                productId: productId,
                qty: 1
            })
        });

        if (cartData.success) {
            alert('Product added to cart successfully!');
            if (typeof cartManager !== 'undefined') {
                cartManager.updateCartDisplay();
            }
        } else {
            throw new Error(cartData.message || 'Failed to add to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert(error.message || 'Failed to add product to cart. Please try again.');
    }
}

// Initialize page
async function init() {
    try {
        console.log('Initializing page...');
        const products = await fetchProducts();
        console.log('Fetched products:', products);
        displayProducts(products);

        // Cart button click handler
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', function() {
                if (Auth.isAuthenticated()) {
                    window.location.href = 'cart.html';
                } else {
                    localStorage.setItem('redirectUrl', 'cart.html');
                    window.location.href = 'login.html';
                }
            });
        }

        // Initialize cart display if cartManager exists
        if (typeof cartManager !== 'undefined') {
            cartManager.updateCartDisplay();
        }
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

// Make handleAddToCart available globally
window.handleAddToCart = handleAddToCart;

// Start the initialization
document.addEventListener('DOMContentLoaded', init);
