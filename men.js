// Fetch products from the API
async function fetchProducts() {
    try {
        const response = await fetch('https://adora-t8e8.onrender.com/api/product/all');
        const data = await response.json();
        return data.products || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Generate product card HTML
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

// Display products in their respective sections
function displayProducts(products) {
    const formalsSection = document.querySelector('#college-outfits .product-grid');
    const festiveSection = document.querySelector('#trendy-outfits .product-grid');
    const casualSection = document.querySelector('#casual-outfits .product-grid');

    products.forEach(product => {
        if (product.category === 'mensection') {
            const productCard = createProductCard(product);
            if (product.type === 'formals' && formalsSection) {
                formalsSection.insertAdjacentHTML('beforeend', productCard);
            } else if (product.type === 'festiveoutfits' && festiveSection) {
                festiveSection.insertAdjacentHTML('beforeend', productCard);
            } else if (product.type === 'casualwear' && casualSection) {
                casualSection.insertAdjacentHTML('beforeend', productCard);
            }
        }
    });
}

// Debounce function to prevent spamming add-to-cart requests
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Add product to cart
async function handleAddToCart(productId, products) {
    if (!cartManager.isLoggedIn()) {
        // Save the current page URL before redirecting to login
        localStorage.setItem('redirectUrl', window.location.href);
        window.location.href = 'login.html';
        return;
    }

    const product = products.find(p => p._id === productId);
    if (!product) {
        alert('Product not found.');
        return;
    }

    try {
        await cartManager.addToCart(product);
        alert('Product added to cart successfully!');
        cartManager.updateCartDisplay(); // Update cart UI
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add product to cart. Please try again.');
    }
}

// Initialize the page
async function init() {
    try {
        const products = await fetchProducts(); // Fetch products from the API
        displayProducts(products); // Display products on the page

        // Add event listener for "Add to Cart" buttons
        document.addEventListener('click', debounce(async function (e) {
            if (e.target && e.target.classList.contains('btn-add-to-cart')) {
                const productId = e.target.getAttribute('data-product-id');
                await handleAddToCart(productId, products);
            }
        }, 300)); // Debounce the add-to-cart click handler

        // Add event listener for cart button
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', function () {
                if (cartManager.isLoggedIn()) {
                    window.location.href = 'cart.html';
                } else {
                    window.location.href = 'login.html';
                }
            });
        }

        // Initialize and update cart display
        cartManager.updateCartDisplay();
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

// Initialize the script
init();
