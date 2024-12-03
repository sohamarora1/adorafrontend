// script.js
const API_URL = 'http://your-api-url'; // Replace with your actual API URL

// Form elements
const productForm = document.getElementById('productForm');
const productId = document.getElementById('productId');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const categoryInput = document.getElementById('category');
const typeInput = document.getElementById('type');
const qtyInput = document.getElementById('qty');
const imgSrcInput = document.getElementById('imgSrc');
const submitBtn = document.getElementById('submitBtn');
const productsList = document.getElementById('productsList');

// Load products when page loads
document.addEventListener('DOMContentLoaded', loadProducts);

// Form submit handler
productForm.addEventListener('submit', handleSubmit);

// Load all products
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products/all`);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display products in the list
function displayProducts(products) {
    productsList.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.imgSrc}" class="product-image" alt="${product.title}">
            <div class="product-info">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
                <p>Category: ${product.category}</p>
                <p>Type: ${product.type}</p>
                <p>Quantity: ${product.qty}</p>
            </div>
            <div class="product-actions">
                <button class="edit-btn" onclick="editProduct('${product._id}')">Edit</button>
                <button class="delete-btn" onclick="deleteProduct('${product._id}')">Delete</button>
            </div>
        `;
        productsList.appendChild(productCard);
    });
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();

    const productData = {
        title: titleInput.value,
        description: descriptionInput.value,
        price: Number(priceInput.value),
        category: categoryInput.value,
        type: typeInput.value,
        qty: Number(qtyInput.value),
        imgSrc: imgSrcInput.value
    };

    try {
        if (productId.value) {
            // Update existing product
            await fetch(`${API_URL}/products/${productId.value}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });
        } else {
            // Add new product
            await fetch(`${API_URL}/products/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });
        }

        // Reset form and reload products
        productForm.reset();
        productId.value = '';
        submitBtn.textContent = 'Add Product';
        loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
    }
}

// Edit product
async function editProduct(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        const product = await response.json();

        // Fill form with product data
        productId.value = product._id;
        titleInput.value = product.title;
        descriptionInput.value = product.description;
        priceInput.value = product.price;
        categoryInput.value = product.category;
        typeInput.value = product.type;
        qtyInput.value = product.qty;
        imgSrcInput.value = product.imgSrc;

        submitBtn.textContent = 'Update Product';
    } catch (error) {
        console.error('Error loading product for edit:', error);
    }
}

// Delete product
async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE'
            });
            loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }
}
