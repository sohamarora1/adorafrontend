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
    // Normalize the search query by trimming and converting to lowercase
    const normalizedQuery = query.trim().toLowerCase();

    // If query is empty, return no results
    if (!normalizedQuery) return [];

    // Split the query into individual words to allow more flexible searching
    const queryWords = normalizedQuery.split(/\s+/);

    // Filter products that match any of the query words in title or description
    return products.filter(product => {
        // Normalize product title and description to lowercase for case-insensitive search
        const normalizedTitle = product.title.toLowerCase();
        const normalizedDescription = product.description.toLowerCase();

        // Check if ALL query words are present in either title or description
        return queryWords.every(word => 
            normalizedTitle.includes(word) || 
            normalizedDescription.includes(word)
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

    // Fetch all products
    const products = await fetchProducts();

    // Function to perform search
    function performSearch(query = '') {
        // Use query from input if not provided
        const searchQuery = query || searchInput.value.trim();
        
        // Clear previous results
        searchedProductsGrid.innerHTML = '';

        // Perform search
        const searchResults = searchProducts(searchQuery, products);

        // Display search results
        if (searchResults.length === 0) {
            searchedProductsGrid.innerHTML = '<p>No products found.</p>';
        } else {
            searchResults.forEach(product => {
                const productCard = createProductCard(product);
                searchedProductsGrid.innerHTML += productCard;
            });

            // Add event listeners for Add to Cart buttons
            document.querySelectorAll('.btn-add-to-cart:not(.disabled)').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const productId = e.target.getAttribute('data-product-id');
                    const product = products.find(p => p._id === productId);
                    addToCart(product);
                });
            });
        }
    }

    // Check for query parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q');

    // If there's an initial query from URL, pre-fill and search
    if (initialQuery) {
        searchInput.value = initialQuery;
        performSearch(initialQuery);
    }

    // Add event listeners for search
    searchButton.addEventListener('click', () => performSearch());
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Initial setup for login/logout buttons
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

// Initialize the page
window.addEventListener('DOMContentLoaded', displaySearchedProducts);
