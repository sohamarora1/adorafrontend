
async function addToCart(product) {
    const token = localStorage.getItem('token');
    
    // Check if user is logged in
    if (!token) {
        // Store the current page to redirect back after login
        localStorage.setItem('returnTo', window.location.href);
        
        // Redirect to login page
        window.location.href = 'login.html';
        return;
    }

    try {
        // Send request to backend to add item to cart
        const response = await fetch('https://adora-t8e8.onrender.com/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Auth': token
            },
            body: JSON.stringify({
                productId: product._id,
                qty: 1
            })
        });

        const data = await response.json();

        if (data.success) {
            // Update cart display
            updateCartDisplay();
            alert('Product added to cart successfully!');
        } else {
            alert(data.message || 'Failed to add product to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('An error occurred while adding the product to cart');
    }
}

function updateCartDisplay() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // Reset cart display if not logged in
        document.getElementById('cart-count').textContent = '0';
        document.getElementById('cart-total').textContent = '₹ 0.00';
        return;
    }

    // Fetch cart details from backend
    fetch('https://adora-t8e8.onrender.com/api/cart/user', {
        headers: {
            'Auth': token
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.cart) {
            const itemCount = data.cart.items.reduce((total, item) => total + item.qty, 0);
            const totalPrice = data.cart.items.reduce((total, item) => total + (item.price * item.qty), 0);

            document.getElementById('cart-count').textContent = itemCount;
            document.getElementById('cart-total').textContent = `₹ ${totalPrice.toFixed(2)}`;
        }
    })
    .catch(error => {
        console.error('Error fetching cart:', error);
    });
}

// Event listener for add to cart buttons
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication status
    const token = localStorage.getItem('token');
    
    // Add event listeners to all add to cart buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', async (e) => {
            // Ensure user is logged in before adding to cart
            if (!token) {
                localStorage.setItem('returnTo', window.location.href);
                window.location.href = 'login.html';
                return;
            }

            const productId = e.target.getAttribute('data-product-id');
            
            try {
                const response = await fetch('https://adora-t8e8.onrender.com/api/product/details', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId })
                });

                const product = await response.json();
                
                if (product) {
                    await addToCart(product);
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
                alert('Failed to add product to cart');
            }
        });
    });

    // Update cart display
    updateCartDisplay();
});

// Check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const profileInitial = document.getElementById('profileInitial');

    if (token) {
        // Fetch user data to get name initial
        fetch('https://adora-t8e8.onrender.com/api/user/profile', {
            headers: {
                'Auth': token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                profileInitial.textContent = data.user.name[0].toUpperCase();
                profileInitial.style.display = 'flex';
            }
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
        });
    } else {
        profileInitial.style.display = 'none';
    }
}

// Call check auth status when page loads
document.addEventListener('DOMContentLoaded', checkAuthStatus);
