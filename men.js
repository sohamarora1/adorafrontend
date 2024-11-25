// men.js

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

function displayProducts(products) {
    const formalsSection = document.querySelector('#college-outfits .product-grid');
    const festiveSection = document.querySelector('#trendy-outfits .product-grid');
    const casualSection = document.querySelector('#casual-outfits .product-grid');

    products.forEach(product => {
        if (product.category === 'mensection') {
            const productCard = createProductCard(product);
            switch (product.type) {
                case 'formals':
                    formalsSection.innerHTML += productCard;
                    break;
                case 'festiveoutfits':
                    festiveSection.innerHTML += productCard;
                    break;
                case 'casualwear':
                    casualSection.innerHTML += productCard;
                    break;
            }
        }
    });
}

async function init() {
    const products = await fetchProducts();
    displayProducts(products);

    // Add to cart click handler
    document.addEventListener('click', async function(e) {
        if (e.target && e.target.classList.contains('btn-add-to-cart')) {
            const productId = e.target.getAttribute('data-product-id');
            const product = products.find(p => p._id === productId);
            if (product) {
                cartManager.addToCart(product);
            }
        }
    });

    // Cart button click handler
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
    }
}


// men.js

// ... (rest of your existing code)

async function init() {
    try {
        const products = await fetchProducts();
        displayProducts(products);

        // Add to cart click handler
        document.addEventListener('click', async function(e) {
            if (e.target && e.target.classList.contains('btn-add-to-cart')) {
                const productId = e.target.getAttribute('data-product-id');
                const product = products.find(p => p._id === productId);
                if (product) {
                    cartManager.addToCart(product);
                }
            }
        });

        // Cart button click handler
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', function() {
                if (cartManager.isLoggedIn()) {
                    window.location.href = 'cart.html';
                } else {
                    window.location.href = 'login.html';
                }
            });
        }

        // Initialize cart display
        cartManager.updateCartDisplay();
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

init();
