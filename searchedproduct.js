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

function searchProducts(query, products) {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];
    const queryWords = normalizedQuery.split(/\s+/);

    return products.filter(product => {
        const normalizedTitle = product.title.toLowerCase();
        const normalizedDescription = product.description.toLowerCase();
        return queryWords.every(word => 
            normalizedTitle.includes(word) || normalizedDescription.includes(word)
        );
    });
}

function createProductCard(product) {
    const token = localStorage.getItem('token');
    const addToCartButton = token
        ? `<button class="btn-add-to-cart" data-product-id="${product._id}">Add to Cart</button>`
        : `<button class="btn-add-to-cart disabled" disabled>Add to Cart</button>`;

    return `
        <div class="product-card">
            <img src="${product.imgSrc}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">₹${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                ${addToCartButton}
            </div>
        </div>
    `;
}

async function displaySearchedProducts() {
    const searchInput = document.getElementById('search-input');
    const searchedProductsGrid = document.getElementById('searched-products-grid');
    const searchButton = document.getElementById('search-button');
    const products = await fetchProducts();

    function performSearch(query = '') {
        const searchQuery = query || searchInput.value.trim();
        searchedProductsGrid.innerHTML = '';
        const searchResults = searchProducts(searchQuery, products);

        if (searchResults.length === 0) {
            searchedProductsGrid.innerHTML = '<p>No products found.</p>';
        } else {
            searchResults.forEach(product => {
                const productCard = createProductCard(product);
                searchedProductsGrid.innerHTML += productCard;
            });

            document.querySelectorAll('.btn-add-to-cart:not(.disabled)').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const productId = e.target.getAttribute('data-product-id');
                    const product = products.find(p => p._id === productId);
                    addToCart(product);
                });
            });
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q');
    if (initialQuery) {
        searchInput.value = initialQuery.trim();
        performSearch(initialQuery.trim());
    }

    searchButton.addEventListener('click', () => performSearch());
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    checkAuth();
    updateCartDisplay();
}

function addToCart(product) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to add items to your cart.');
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

function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const itemCount = cart.reduce((total, item) => total + item.qty, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.qty), 0);
    cartCount.textContent = itemCount;
    cartTotal.textContent = `₹ ${totalPrice.toFixed(2)}`;
}

function checkAuth() {
    const token = localStorage.getItem('token');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (token) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';

        logoutBtn.onclick = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('cart');
            window.location.reload();
        };
    } else {
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';

        loginBtn.onclick = () => {
            localStorage.setItem('redirectUrl', window.location.href);
            window.location.href = 'login.html';
        };
    }
}

window.addEventListener('DOMContentLoaded', displaySearchedProducts);
