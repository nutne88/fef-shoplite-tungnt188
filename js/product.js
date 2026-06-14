document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const loadingSection = document.getElementById('product-loading');
    const errorSection = document.getElementById('product-error');
    const detailContainer = document.getElementById('product-detail-container');
    const breadcrumbCategory = document.getElementById('breadcrumb-category');
    const detailImg = document.getElementById('detail-img');
    const detailCategory = document.getElementById('detail-category');
    const detailTitle = document.getElementById('detail-title');
    const ratingStars = document.getElementById('rating-stars');
    const ratingText = document.getElementById('rating-text');
    const detailPrice = document.getElementById('detail-price');
    const detailDescription = document.getElementById('detail-description');
    const quantityInput = document.getElementById('quantity-input');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    let currentProduct = null;
    await initDetailPage();

    async function initDetailPage() {
        if (!productId) {
            showErrorUI();
            return;
        }

        try {
            loadingSection.classList.remove('d-none');
            detailContainer.classList.add('d-none');
            errorSection.classList.add('d-none');
            currentProduct = await getProductById(productId);
            if (!currentProduct) {
                showErrorUI();
                return;
            }
            renderProductDetail(currentProduct);

        } catch (error) {
            showErrorUI();
        } finally {
            loadingSection.classList.add('d-none');
        }
    }

    /**Render product details 
     */
    function renderProductDetail(product) {
        document.title = `ShopLite — ${product.title}`;
        breadcrumbCategory.textContent = product.category;
        detailCategory.textContent = product.category;
        detailTitle.textContent = product.title;
        detailPrice.textContent = `$${product.price.toFixed(2)}`;
        detailDescription.textContent = product.description;
        detailImg.src = product.image;
        detailImg.alt = product.title;
        renderRatingStars(product.rating.rate);
        ratingText.textContent = `(${product.rating.rate} from ${product.rating.count} reviews)`;
        detailContainer.classList.remove('d-none');
    }

    /**Function render rating stars based on the product's rating value
     */
    function renderRatingStars(rate) {
        const roundedRate = Math.round(rate); 
        let starsHTML = '';

        for (let i = 1; i <= 5; i++) {
            if (i <= roundedRate) {
                starsHTML += '<i class="bi bi-star-fill"></i> '; // Full
            } else {
                starsHTML += '<i class="bi bi-star"></i> '; // Empty
            }
        }
        ratingStars.innerHTML = starsHTML;
    }

    function showErrorUI() {
        errorSection.classList.remove('d-none');
        loadingSection.classList.add('d-none');
        detailContainer.classList.add('d-none');
    }

    // Add to Cart
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);

        if (isNaN(quantity) || quantity <= 0) {
            alert('Please enter a valid quantity (at least 1)!');
            quantityInput.value = 1;
            return;
        }

        if (typeof addToCart === 'function') {
            addToCart(currentProduct.id, quantity);
        }
    });
});