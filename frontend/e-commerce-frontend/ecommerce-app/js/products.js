// products.js - Product Service
class ProductService {
    constructor(apiBaseUrl, authService) {
        this.API_BASE_URL = apiBaseUrl;
        this.authService = authService;
    }

    // Load all products
    async loadProducts() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/products`);
            
            if (response.ok) {
                const products = await response.json();
                return { success: true, data: products };
            } else {
                return { success: false, error: 'Failed to load products' };
            }
        } catch (error) {
            console.error('Error loading products:', error);
            return { success: false, error: 'Network error loading products' };
        }
    }

    // Search products by keyword
    async searchProducts(keyword) {
        if (!keyword.trim()) {
            return this.loadProducts();
        }

        try {
            const response = await fetch(
                `${this.API_BASE_URL}/products/search?keyword=${encodeURIComponent(keyword)}`
            );
            
            if (response.ok) {
                const products = await response.json();
                return { success: true, data: products };
            } else {
                return { success: false, error: 'Search failed' };
            }
        } catch (error) {
            console.error('Search error:', error);
            return { success: false, error: 'Network error during search' };
        }
    }

    // Add new product
    async addProduct(productData) {
        if (!this.authService.isAuthenticated()) {
            return { success: false, error: 'Please login to add products' };
        }

        try {
            const response = await fetch(`${this.API_BASE_URL}/products`, {
                method: 'POST',
                headers: this.authService.getAuthHeaders(),
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                const product = await response.json();
                return { success: true, data: product, message: 'Product added successfully!' };
            } else {
                const error = await response.text();
                return { success: false, error: `Failed to add product: ${error}` };
            }
        } catch (error) {
            console.error('Error adding product:', error);
            return { success: false, error: 'Network error adding product' };
        }
    }

    // Update product
    async updateProduct(productId, productData) {
        if (!this.authService.isAuthenticated()) {
            return { success: false, error: 'Please login to update products' };
        }

        try {
            const response = await fetch(`${this.API_BASE_URL}/products/${productId}`, {
                method: 'PUT',
                headers: this.authService.getAuthHeaders(),
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                const product = await response.json();
                return { success: true, data: product, message: 'Product updated successfully!' };
            } else {
                const error = await response.text();
                return { success: false, error: `Failed to update product: ${error}` };
            }
        } catch (error) {
            console.error('Error updating product:', error);
            return { success: false, error: 'Network error updating product' };
        }
    }

    // Delete product
    async deleteProduct(productId) {
        if (!this.authService.isAuthenticated()) {
            return { success: false, error: 'Please login to delete products' };
        }

        try {
            const response = await fetch(`${this.API_BASE_URL}/products/${productId}`, {
                method: 'DELETE',
                headers: this.authService.getAuthHeaders()
            });

            if (response.ok) {
                return { success: true, message: 'Product deleted successfully!' };
            } else {
                return { success: false, error: 'Failed to delete product' };
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            return { success: false, error: 'Network error deleting product' };
        }
    }

    // Get product by ID
    async getProduct(productId) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/products/${productId}`);
            
            if (response.ok) {
                const product = await response.json();
                return { success: true, data: product };
            } else {
                return { success: false, error: 'Product not found' };
            }
        } catch (error) {
            console.error('Error loading product:', error);
            return { success: false, error: 'Network error loading product' };
        }
    }
}