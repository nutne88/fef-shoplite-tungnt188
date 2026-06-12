
let cart = JSON.parse(localStorage.getItem('SHOPLITE_CART')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    
    // Activate the detailed cart rendering engine only if currently navigating on cart.html
    if (window.location.pathname.includes('cart.html')) {
        initCartPage();
    }
});

function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    if (!cartBadge) return;

    // Calculate the total combined quantity of all selected items in the cart
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.classList.remove('d-none'); // Reveal badge if items are present
    } else {
        cartBadge.classList.add('d-none'); // Hide badge if the cart state is empty
    }
}

function saveCartToStorage() {
    localStorage.setItem('SHOPLITE_CART', JSON.stringify(cart));
    updateCartBadge();
}

/** Appends a product item into the cart structure
 * @param {number|string} productId - Unique identifier of the product
 * @param {number} quantity - Quantity volume intended for addition (Defaults to 1)
 */
async function addToCart(productId, quantity = 1) {
    const pId = parseInt(productId);
    
    // Verify if this specific product reference already populates the active cart array
    const existingItem = cart.find(item => item.id === pId);

    if (existingItem) {
        // If it already exists, sequentially increment its quantity allocation
        existingItem.quantity += quantity;
        saveCartToStorage();
        showToastNotification();
    } else {
        try {
            if (typeof getProductById === 'function') {
                const product = await getProductById(pId);
                cart.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
                saveCartToStorage();
                showToastNotification();
            }
        } catch (error) {
            alert('Failed to add product to cart due to a network connection issue!');
        }
    }
}

/** Displays the screen corner Toast notification trigger upon successful cart item increments (Excellent Tier)
 */
function showToastNotification() {
    const toastEl = document.getElementById('live-toast');
    if (toastEl && typeof bootstrap !== 'undefined') {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }
}

function initCartPage() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartState = document.getElementById('empty-cart-state');
    const cartContent = document.getElementById('cart-content');
    const clearCartBtn = document.getElementById('clear-cart-btn');

    renderCartDetails();

    /**Iterates the cart contents array and renders descriptive HTML markup layouts
     */
    function renderCartDetails() {
        if (cart.length === 0) {
            // Empty state routing
            emptyCartState.classList.remove('d-none');
            cartContent.classList.add('d-none');
            return;
        }

        emptyCartState.classList.add('d-none');
        cartContent.classList.remove('d-none');

        // Map through active collection data and interpolate component elements structure
        const itemsHTML = cart.map(item => {
            return `
                <div class="p-3 border-bottom bg-white">
                    <div class="row align-items-center g-3">
                        <div class="col-3 col-sm-2 text-center">
                            <img src="${item.image}" alt="${item.title}" class="img-fluid" style="max-height: 80px; object-fit: contain;">
                        </div>
                        <div class="col-9 col-sm-4">
                            <h6 class="mb-1 text-dark text-truncate" title="${item.title}">${item.title}</h6>
                            <span class="text-muted small">Price: $${item.price.toFixed(2)}</span>
                        </div>
                        <div class="col-6 col-sm-3 d-flex align-items-center">
                            <button class="btn btn-outline-secondary btn-sm px-2 change-qty-btn" data-id="${item.id}" data-action="decrease">-</button>
                            <span class="mx-3 fw-bold">${item.quantity}</span>
                            <button class="btn btn-outline-secondary btn-sm px-2 change-qty-btn" data-id="${item.id}" data-action="increase">+</button>
                        </div>
                        <div class="col-6 col-sm-3 text-end d-flex align-items-center justify-content-end">
                            <span class="fw-bold text-danger me-3">$${(item.price * item.quantity).toFixed(2)}</span>
                            <button class="btn btn-link text-danger p-0 remove-item-btn" data-id="${item.id}">
                                <i class="bi bi-trash3 fs-5"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = itemsHTML.join('');
        calculateCartTotal();
    }

    /** Computes the grand total and sync 
     */
    function calculateCartTotal() {
        const totalQuantityEl = document.getElementById('total-quantity');
        const cartTotalEl = document.getElementById('cart-total');

        const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        if (totalQuantityEl) totalQuantityEl.textContent = totalQuantity;
        if (cartTotalEl) cartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;
    }

    // Maintain a single global click listener 
    cartItemsContainer.addEventListener('click', (event) => {
        // A. Route logic tracking for quantity adjustment trigger element hits
        const qtyBtn = event.target.closest('.change-qty-btn');
        if (qtyBtn) {
            const id = parseInt(qtyBtn.getAttribute('data-id'));
            const action = qtyBtn.getAttribute('data-action');
            const targetItem = cart.find(item => item.id === id);

            if (targetItem) {
                if (action === 'increase') {
                    targetItem.quantity += 1;
                } else if (action === 'decrease') {
                    targetItem.quantity -= 1;
                    // Auto-purge the product item object from index sequence lists if quantity reaches zero limits
                    if (targetItem.quantity <= 0) {
                        cart = cart.filter(item => item.id !== id);
                    }
                }
                saveCartToStorage();
                renderCartDetails(); // Refresh and re-render 
            }
        }

        // Trash-can deletion
        const removeBtn = event.target.closest('.remove-item-btn');
        if (removeBtn) {
            const id = parseInt(removeBtn.getAttribute('data-id'));
            cart = cart.filter(item => item.id !== id);
            saveCartToStorage();
            renderCartDetails();
        }
    });

    // Cart sweeping
    clearCartBtn.addEventListener('click', () => {
        if (confirm('Are you absolutely sure you want to remove all products from your shopping cart?')) {
            cart = [];
            saveCartToStorage();
            renderCartDetails();
        }
    });
}