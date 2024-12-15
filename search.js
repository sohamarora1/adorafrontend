// Search functionality
function setupSearch(products) {
    const searchField = document.querySelector('.search-field');
    const searchSubmit = document.querySelector('.search-submit');

    function performSearch() {
        const searchTerm = searchField.value.toLowerCase().trim();
        
        // Save search term to localStorage for use in searchedproducts.html
        localStorage.setItem('searchTerm', searchTerm);
        
        // Redirect to searched products page
        window.location.href = 'searchedproducts.html';
    }

    // Add event listeners for search
    searchSubmit.addEventListener('click', performSearch);
    
    // Allow search on Enter key press
    searchField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Modify the existing init function to include search setup
async function init() {
    const products = await fetchProducts();
    displayProducts(products);
    updateCartDisplay();

    // Initialize search functionality
    setupSearch(products);

    // ... (rest of the existing init function remains the same)
}

// Call the modified init function
init();
