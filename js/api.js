
//Base URL of the API
const BASE_URL = 'https://fakestoreapi.com';

/**
 @param {string} endpoint 
 @returns {Promise<any>}
 */
async function fetchFromAPI(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);

        if (!response.ok) {
            throw new Error(`Network response error: Status code ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`[API Error] Failed to fetch endpoint ${endpoint}:`, error);
        throw error;
    }
}

/** Endpoint: GET /products
 @returns {Promise<Array>}
 */
async function getAllProducts() {
    return await fetchFromAPI('/products');
}

/** Endpoint: GET /products/{id}
 @param {number|string} id
 @returns {Promise<Object>} 
 */
async function getProductById(id) {
    return await fetchFromAPI(`/products/${id}`);
}

/**Endpoint: GET /products/categories
 @returns {Promise<Array<string>>} 
 */
async function getCategories() {
    return await fetchFromAPI('/products/categories');
}

/**Endpoint: GET /products/category/{categoryName}
  @param {string} categoryName 
  @returns {Promise<Array>}
 */
async function getProductsByCategory(categoryName) {
    const encodedCategory = encodeURIComponent(categoryName);
    return await fetchFromAPI(`/products/category/${encodedCategory}`);
}