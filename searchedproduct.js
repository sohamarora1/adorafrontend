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
    const token = localStorage.getItem('token'); // Check if user is logged in
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

    if (cartCount) cartCount.textContent = itemCount;
    if (cartTotal) cartTotal.textContent = `₹ ${totalPrice.toFixed(2)}`;
}

function performSearch(products) {
    const searchInput = document.getElementById('search-input');
    const searchSubmit = document.getElementById('search-submit');
    const resultsGrid = document.getElementById('results-grid');

    function doSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // Clear previous search results
        resultsGrid.innerHTML = '';

        // If search term is empty, show a message
        if (searchTerm === '') {
            resultsGrid.innerHTML = '<p>Please enter a search term.</p>';
            return;
        }

        // Filter products based on search term
        const filteredProducts = products.filter(product => 
            (product.title.toLowerCase().includes(searchTerm) || 
             product.description.toLowerCase().includes(searchTerm))
        );

        // Display search results
        if (filteredProducts.length > 0) {
            filteredProducts.forEach(product => {
                const productCard = createProductCard(product);
                resultsGrid.innerHTML += productCard;
            });
        } else {
            resultsGrid.innerHTML = '<p>No products found matching your search.</p>';
        }
    }

    // Add event listeners for search
    searchSubmit.addEventListener('click', doSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            doSearch();
        }
    });

    // Event delegation for Add to Cart
    resultsGrid.addEventListener('click', async function (e) {
        if (e.target && e.target.classList.contains('btn-add-to-cart')) {
            const productId = e.target.getAttribute('data-product-id');
            const product = products.find(p => p._id === productId);
            if (product) {
                addToCart(product);
            }
        }
    });
}

async function init() {
    const products = await fetchProducts();
    performSearch(products);
    updateCartDisplay();
}

// Check authentication on page load
function checkAuth() {
    const token = localStorage.getItem('token');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (token) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';

        if (logoutBtn) {
            logoutBtn.onclick = () => {
                localStorage.removeItem('token'); // Clear the token
                localStorage.removeItem('cart'); // Clear the local cart
                window.location.reload();
            };
        }
    } else {
        // User is not logged in
        if (loginBtn) loginBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';

        if (loginBtn) {
            loginBtn.onclick = () => {
                localStorage.setItem('redirectUrl', window.location.href); // Save redirect URL
                window.location.href = 'login.html'; // Redirect to login page
            };
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    init();
    checkAuth();
});
