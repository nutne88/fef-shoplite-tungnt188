

// 1. Global state variable to hold original product data fetched from the API 
let originalProducts = [];

// 2. Wait until the HTML Document is fully parsed and loaded before executing JS logic
document.addEventListener('DOMContentLoaded', async () => {
    // Acquire required DOM Elements
    const productGrid = document.getElementById('product-grid');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const categorySelect = document.getElementById('category-select');
    const sortSelect = document.getElementById('sort-select');
    const searchInput = document.getElementById('search-input');

    // Trigger the initial setup process for the Home Page
    await initHomePage();

    /** Main initialization function for the Home Page
     */
    async function initHomePage() {
        try {
            //Trigger loading state view
            loadingSpinner.classList.remove('d-none');
            productGrid.innerHTML = '';
            errorMessage.classList.add('d-none');

            //Fetch product data and categories
            const [products, categories] = await Promise.all([
                getAllProducts(),
                getCategories()
            ]);

            // Save data to global state
            originalProducts = products;

            // Populate the Select drop-down toolbar with category lists
            renderCategories(categories);

            // Render initial product items layout onto the grid
            renderProducts(originalProducts);

        } catch (error) {
            errorMessage.classList.remove('d-none');
        } finally {
            loadingSpinner.classList.add('d-none');
        }
    }

    /**Renders the product array into responsive HTML Card components (Bootstrap 5 layouts)
     *  @param {Array} productsList 
     */
    function renderProducts(productsList) {
        // Fallback UI block if no products match the query parameters or active filter conditions
        if (productsList.length === 0) {
            productGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-search text-muted fs-1"></i>
                    <p class="text-muted mt-2">No products found matching your criteria!</p>
                </div>
            `;
            return;
        }

        // Loop through each item and create the dynamic element structures
        const cardHTMLs = productsList.map(product => {
            return `
                <div class="col">
                    <div class="card product-card">
                        <div class="product-img-wrapper">
                            <img src="${product.image}" class="product-img" alt="${product.title}">
                        </div>
                        <div class="product-body">
                            <h5 class="product-title" title="${product.title}">${product.title}</h5>
                            <div class="product-price">$${product.price.toFixed(2)}</div>
                            
                            <div class="mt-auto row g-2">
                                <div class="col-6">
                                    <a href="product.html?id=${product.id}" class="btn btn-outline-primary btn-sm w-100">Details</a>
                                </div>
                                <div class="col-6">
                                    <button class="btn btn-primary btn-sm w-100 add-to-cart-fast-btn" data-id="${product.id}">
                                        <i class="bi bi-cart-plus"></i> Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        productGrid.innerHTML = cardHTMLs.join('');
    }

    /**Appends dynamic data arrays into the category select drop-down field
     @param {Array<string>} categoriesList
     */
    function renderCategories(categoriesList) {
        categoriesList.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1); 
            categorySelect.appendChild(option);
        });
    }


    function applyFilterSearchAndSort() {
        let filtered = [...originalProducts];

        const keyword = searchInput.value.trim().toLowerCase();
        if (keyword) {
            filtered = filtered.filter(p => p.title.toLowerCase().includes(keyword));
        }

        const selectedCategory = categorySelect.value;
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        const sortType = sortSelect.value;
        if (sortType === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price); 
        } else if (sortType === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price); 
        }

        // Re-render the layout interface with the refined results list
        renderProducts(filtered);
    }

    // Attach real-time event tracking loops into the configuration filter controls
    searchInput.addEventListener('input', applyFilterSearchAndSort);
    categorySelect.addEventListener('change', applyFilterSearchAndSort);
    sortSelect.addEventListener('change', applyFilterSearchAndSort);

});