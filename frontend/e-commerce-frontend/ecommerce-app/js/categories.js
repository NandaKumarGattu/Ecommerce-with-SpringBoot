// categories.js - Category Service
class CategoryService {
    constructor(apiBaseUrl, authService) {
        this.API_BASE_URL = apiBaseUrl;
        this.authService = authService;
    }

    // Load all categories
    async loadCategories() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/categories`);
            
            if (response.ok) {
                const categories = await response.json();
                return { success: true, data: categories };
            } else {
                // Return empty array for now if endpoint doesn't exist
                return { success: true, data: [] };
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            // Return empty array on error for graceful degradation
            return { success: true, data: [] };
        }
    }

    // Add new category
    async addCategory(categoryData) {
        if (!this.authService.isAuthenticated()) {
            return { success: false, error: 'Please login to add categories' };
        }

        try {
            const response = await fetch(`${this.API_BASE_URL}/categories`, {
                method: 'POST',
                headers: this.authService.getAuthHeaders(),
                body: JSON.stringify(categoryData)
            });

            if (response.ok) {
                const category = await response.json();
                return { success: true, data: category, message: 'Category added successfully!' };
            } else {
                const error = await response.text();
                return { success: false, error: `Failed to add category: ${error}` };
            }
        } catch (error) {
            console.error('Error adding category:', error);
            return { success: false, error: 'Network error adding category' };
        }
    }

    // Update category
    async updateCategory(categoryId, categoryData) {
        if (!this.authService.isAuthenticated()) {
            return { success: false, error: 'Please login to update categories' };
        }

        try {
            const response = await fetch(`${this.API_BASE_URL}/categories/${categoryId}`, {
                method: 'PUT',
                headers: this.authService.getAuthHeaders(),
                body: JSON.stringify(categoryData)
            });

            if (response.ok) {
                const category = await response.json();
                return { success: true, data: category, message: 'Category updated successfully!' };
            } else {
                const error = await response.text();
                return { success: false, error: `Failed to update category: ${error}` };
            }
        } catch (error) {
            console.error('Error updating category:', error);
            return { success: false, error: 'Network error updating category' };
        }
    }

    // Delete category
    async deleteCategory(categoryId) {
        if (!this.authService.isAuthenticated()) {
            return { success: false, error: 'Please login to delete categories' };
        }

        try {
            const response = await fetch(`${this.API_BASE_URL}/categories/${categoryId}`, {
                method: 'DELETE',
                headers: this.authService.getAuthHeaders()
            });

            if (response.ok) {
                return { success: true, message: 'Category deleted successfully!' };
            } else {
                return { success: false, error: 'Failed to delete category' };
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            return { success: false, error: 'Network error deleting category' };
        }
    }

    // Get category by ID
    async getCategory(categoryId) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/categories/${categoryId}`);
            
            if (response.ok) {
                const category = await response.json();
                return { success: true, data: category };
            } else {
                return { success: false, error: 'Category not found' };
            }
        } catch (error) {
            console.error('Error loading category:', error);
            return { success: false, error: 'Network error loading category' };
        }
    }

    // Get products by category
    async getProductsByCategory(categoryId) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/categories/${categoryId}/products`);
            
            if (response.ok) {
                const products = await response.json();
                return { success: true, data: products };
            } else {
                return { success: false, error: 'Failed to load products for category' };
            }
        } catch (error) {
            console.error('Error loading products by category:', error);
            return { success: false, error: 'Network error loading products' };
        }
    }
}