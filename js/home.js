// 1. Global state variable to hold original product data fetched from the API
let originalProducts = [];
let displayedCount = 8;
const ITEMS_PER_PAGE = 4;
let currentFilteredList = [];

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 2. Wait until the HTML Document is fully parsed and loaded before executing JS logic
document.addEventListener("DOMContentLoaded", async () => {
  // Acquire required DOM Elements
  const productGrid = document.getElementById("product-grid");
  const loadingSpinner = document.getElementById("loading-spinner");
  const errorMessage = document.getElementById("error-message");
  const categorySelect = document.getElementById("category-select");
  const sortSelect = document.getElementById("sort-select");
  const searchInput = document.getElementById("search-input");
  const loadMoreContainer = document.getElementById("load-more-container");
  const loadMoreBtn = document.getElementById("load-more-btn");

  // Trigger the initial setup process for the Home Page
  await initHomePage();

  /** Main initialization function for the Home Page
   */
  async function initHomePage() {
    try {
      //Trigger loading state view
      loadingSpinner.classList.remove("d-none");
      productGrid.innerHTML = "";
      errorMessage.classList.add("d-none");

      //Fetch product data and categories
      const [products, categories] = await Promise.all([
        getAllProducts(),
        getCategories(),
      ]);

      // Save data to global state
      originalProducts = products;
      currentFilteredList = products;

      // Populate the Select drop-down toolbar with category lists
      renderCategories(categories);
      renderProducts(currentFilteredList.slice(0, displayedCount));
      updateLoadMoreVisibility();
    } catch (error) {
      errorMessage.classList.remove("d-none");
    } finally {
      loadingSpinner.classList.add("d-none");
    }
  }

  /**Renders the product array into responsive HTML Card components (Bootstrap 5 layouts)
   * @param {Array} productsList
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
      if (loadMoreContainer) loadMoreContainer.classList.add("d-none");
      return;
    }

    // Loop through each item and create the dynamic element structures
    const cardHTMLs = productsList.map((product) => {
      return `
                <div class="col">
                    <div class="card product-card">
                        <a href="product.html?id=${product.id}" class="product-img-wrapper">
                            <img src="${product.image}" class="product-img" alt="${product.title}">
                        </a>
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

    productGrid.innerHTML = cardHTMLs.join("");
  }

  /**Appends dynamic data arrays into the category select drop-down field
     @param {Array<string>} categoriesList
     */
  function renderCategories(categoriesList) {
    categoriesList.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      categorySelect.appendChild(option);
    });
  }

  function applyFilterSearchAndSort() {
    let filtered = [...originalProducts];

    const keyword = searchInput.value.trim().toLowerCase();
    if (keyword) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(keyword),
      );
    }

    const selectedCategory = categorySelect.value;
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    const sortType = sortSelect.value;
    if (sortType === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortType === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    currentFilteredList = filtered;
    displayedCount = 8;

    renderProducts(currentFilteredList.slice(0, displayedCount));
    updateLoadMoreVisibility();
  }

  function updateLoadMoreVisibility() {
    if (!loadMoreContainer) return;
    if (displayedCount < currentFilteredList.length) {
      loadMoreContainer.classList.remove("d-none");
    } else {
      loadMoreContainer.classList.add("d-none");
    }
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      displayedCount += ITEMS_PER_PAGE;
      renderProducts(currentFilteredList.slice(0, displayedCount));
      updateLoadMoreVisibility();
    });
  }

  // Prevent multiple rapid calls
  searchInput.addEventListener(
    "input",
    debounce(applyFilterSearchAndSort, 300),
  );
  categorySelect.addEventListener("change", applyFilterSearchAndSort);
  sortSelect.addEventListener("change", applyFilterSearchAndSort);

  // Event delegation
  productGrid.addEventListener("click", (event) => {
    const clickTarget = event.target.closest(".add-to-cart-fast-btn");

    if (clickTarget) {
      const productId = clickTarget.getAttribute("data-id");

      if (typeof addToCart === "function") {
        addToCart(productId, 1);
      }
    }
  });
});
