document.addEventListener('DOMContentLoaded', () => {
    // Subtle hover effects for product cards
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const addToCartBtn = card.querySelector('.btn-add-to-cart');
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px)';
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
            
            if (addToCartBtn) {
                addToCartBtn.style.transform = 'scale(1.05)';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            
            if (addToCartBtn) {
                addToCartBtn.style.transform = 'scale(1)';
            }
        });
    });

    // Animated search icon interaction
    const searchField = document.querySelector('.search-field');
    const searchSubmit = document.querySelector('.search-submit');

    searchField.addEventListener('focus', () => {
        searchSubmit.style.transform = 'translateY(-50%) rotate(360deg)';
    });

    searchField.addEventListener('blur', () => {
        searchSubmit.style.transform = 'translateY(-50%) rotate(0deg)';
    });
});
