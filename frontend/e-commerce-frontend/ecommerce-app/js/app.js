// app.js - Main Application Controller
class ECommerceApp {
    constructor() {
        this.API_BASE_URL = 'http://localhost:8081/api';
        
        // Initialize services
        this.authService = new AuthService(this.API_BASE_URL);
        this.productService = new ProductService(this.API_BASE_URL, this.authService);
        this.categoryService = new CategoryService(this.API_BASE_URL, this.authService);
        this.ui = new UIManager();
        
        // Initialize app
        this.init();
    }

    // Initialize application
    init() {
        this.setupEventListeners();
        this.updateAuthStatus();
        this.loadInitialData();
    }

    // Setup event listeners
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Add product form
        const addProductForm = document.getElementById('addProductForm');
        if (addProductForm) {
            addProductForm.addEventListener('submit', (e) => this.handleAddProduct(e));
        }

        // Add category form
        const addCategoryForm = document.getElementById('addCategoryForm');
        if (addCategoryForm) {
            addCategoryForm.addEventListener('submit', (e) => this.handleAddCategory(e));
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchProducts();
                }
            });
        }

        // Modal close functionality
        window.onclick = (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        };
    }

    // Update authentication status
    updateAuthStatus() {
        const isAuthenticated = this.authService.isAuthenticated();
        const username = this.authService.getCurrentUser();
        this.ui.updateAuthUI(isAuthenticated, username);
    }

    // Load initial data
    async loadInitialData() {
        await this.loadProducts();
        await this.loadCategories();
    }

    // Authentication handlers
    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        this.ui.showAlert('loginAlert', 'Logging in...', 'info');
        
        const result = await this.authService.login(username, password);
        
        if (result.success) {
            this.ui.showAlert('loginAlert', 'Login successful!', 'success');
            this.updateAuthStatus();
            this.ui.showSection('products');
            this.ui.clearForm('loginForm');
        } else {
            this.ui.showAlert('loginAlert', result.error, 'danger');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        this.ui.showAlert('registerAlert', 'Registering...', 'info');
        
        const result = await this.authService.register(username, email, password);
        
        if (result.success) {
            this.ui.showAlert('registerAlert', result.message, 'success');
            this.ui.clearForm('registerForm');
            setTimeout(() => this.ui.showSection('login'), 2000);
        } else {
            this.ui.showAlert('registerAlert', result.error, 'danger');
        }
    }

    logout() {
        this.authService.logout();
        this.updateAuthStatus();
        this.ui.showSection('login');
    }

    // Product handlers
    async loadProducts() {
        this.ui.showLoading('productsLoading');
        
        const result = await this.productService.loadProducts();
        
        if (result.success) {
            this.ui.displayProducts(result.data);
            this.ui.clearAlert('productsAlert');
        } else {
            this.ui.showAlert('productsAlert', result.error, 'danger');
        }
        
        this.ui.hideLoading('productsLoading');
    }

    async searchProducts() {
        const keyword = document.getElementById('searchInput').value.trim();
        
        this.ui.showLoading('productsLoading');
        
        const result = await this.productService.searchProducts(keyword);
        
        if (result.success) {
            this.ui.displayProducts(result.data);
            this.ui.clearAlert('productsAlert');
        } else {
            this.ui.showAlert('productsAlert', result.error, 'danger');
        }
        
        this.ui.hideLoading('productsLoading');
    }

    async handleAddProduct(e) {
        e.preventDefault();
        
        const productData = {
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stockQuantity: parseInt(document.getElementById('productStock').value),
            imageUrl: document.getElementById('productImageUrl').value
        };

        const categoryId = document.getElementById('productCategory').value;
        if (categoryId) {
            productData.category = { id: parseInt(categoryId) };
        }

        const result = await this.productService.addProduct(productData);
        
        if (result.success) {
            this.ui.showAlert('productsAlert', result.message, 'success');
            this.ui.clearForm('addProductForm');
            this.ui.closeModal('addProductModal');
            await this.loadProducts();
        } else {
            this.ui.showAlert('productsAlert', result.error, 'danger');
        }
    }

    async deleteProduct(productId) {
        if (!this.ui.showConfirmation('Are you sure you want to delete this product?')) {
            return;
        }

        const result = await this.productService.deleteProduct(productId);
        
        if (result.success) {
            this.ui.showAlert('productsAlert', result.message, 'success');
            await this.loadProducts();
        } else {
            this.ui.showAlert('productsAlert', result.error, 'danger');
        }
    }

    // Category handlers
    async loadCategories() {
        this.ui.showLoading('categoriesLoading');
        
        const result = await this.categoryService.loadCategories();
        
        if (result.success) {
            this.ui.displayCategories(result.data);
            this.ui.populateCategoryDropdown(result.data);
            this.ui.clearAlert('categoriesAlert');
        } else {
            this.ui.showAlert('categoriesAlert', result.error, 'danger');
        }
        
        this.ui.hideLoading('categoriesLoading');
    }

    async handleAddCategory(e) {
        e.preventDefault();
        
        const categoryData = {
            name: document.getElementById('categoryName').value,
            description: document.getElementById('categoryDescription').value
        };

        const result = await this.categoryService.addCategory(categoryData);
        
        if (result.success) {
            this.ui.showAlert('categoriesAlert', result.message, 'success');
            this.ui.clearForm('addCategoryForm');
            this.ui.closeModal('addCategoryModal');
            await this.loadCategories();
        } else {
            this.ui.showAlert('categoriesAlert', result.error, 'danger');
        }
    }

    async deleteCategory(categoryId) {
        if (!this.ui.showConfirmation('Are you sure you want to delete this category?')) {
            return;
        }

        const result = await this.categoryService.deleteCategory(categoryId);
        
        if (result.success) {
            this.ui.showAlert('categoriesAlert', result.message, 'success');
            await this.loadCategories();
        } else {
            this.ui.showAlert('categoriesAlert', result.error, 'danger');
        }
    }

    // UI helper methods
    showSection(sectionName) {
        this.ui.showSection(sectionName);
        
        // Load data for specific sections
        if (sectionName === 'products') {
            this.loadProducts();
        } else if (sectionName === 'categories') {
            this.loadCategories();
        }
    }

    showAddProductModal() {
        if (!this.authService.isAuthenticated()) {
            this.ui.showAlert('productsAlert', 'Please login to add products', 'danger');
            return;
        }
        this.loadCategories(); // Refresh categories for dropdown
        this.ui.showModal('addProductModal');
    }

    showAddCategoryModal() {
        if (!this.authService.isAuthenticated()) {
            this.ui.showAlert('categoriesAlert', 'Please login to add categories', 'danger');
            return;
        }
        this.ui.showModal('addCategoryModal');
    }

    closeModal(modalId) {
        this.ui.closeModal(modalId);
    }

    // Edit functionality methods
    editProduct(productId) {
        this.ui.showAlert('productsAlert', 'Edit functionality coming soon!', 'info');
        // TODO: Implement edit product functionality
        console.log('Edit product:', productId);
    }

    editCategory(categoryId) {
        this.ui.showAlert('categoriesAlert', 'Edit functionality coming soon!', 'info');
        // TODO: Implement edit category functionality
        console.log('Edit category:', categoryId);
    }

    // Filter and sorting methods
    async filterProductsByCategory(categoryId) {
        this.ui.showLoading('productsLoading');
        
        const result = await this.productService.filterProductsByCategory(categoryId);
        
        if (result.success) {
            this.ui.displayProducts(result.data);
            this.ui.clearAlert('productsAlert');
        } else {
            this.ui.showAlert('productsAlert', result.error, 'danger');
        }
        
        this.ui.hideLoading('productsLoading');
    }

    sortProducts(sortBy, order = 'asc') {
        const products = this.ui.getCurrentProducts();
        const sortedProducts = this.sortProductsArray(products, sortBy, order);
        this.ui.displayProducts(sortedProducts);
    }

    sortProductsArray(products, sortBy, order) {
        return products.sort((a, b) => {
            let valueA, valueB;
            
            switch (sortBy) {
                case 'name':
                    valueA = a.name.toLowerCase();
                    valueB = b.name.toLowerCase();
                    break;
                case 'price':
                    valueA = a.price;
                    valueB = b.price;
                    break;
                case 'stock':
                    valueA = a.stockQuantity;
                    valueB = b.stockQuantity;
                    break;
                default:
                    return 0;
            }
            
            if (order === 'desc') {
                return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
            } else {
                return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
            }
        });
    }

    // Utility methods
    clearAllForms() {
        const forms = ['loginForm', 'registerForm', 'addProductForm', 'addCategoryForm'];
        forms.forEach(formId => this.ui.clearForm(formId));
    }

    clearAllAlerts() {
        const alerts = ['loginAlert', 'registerAlert', 'productsAlert', 'categoriesAlert'];
        alerts.forEach(alertId => this.ui.clearAlert(alertId));
    }

    // Error handling
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        const message = context ? `Error in ${context}: ${error.message}` : error.message;
        this.ui.showAlert('globalAlert', message, 'danger');
    }

    // Application lifecycle methods
    onBeforeUnload() {
        // Clean up resources before page unload
        console.log('Application shutting down...');
    }

    refresh() {
        this.clearAllAlerts();
        this.loadInitialData();
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ECommerceApp();
    
    // Handle page unload
    window.addEventListener('beforeunload', () => {
        if (window.app) {
            window.app.onBeforeUnload();
        }
    });
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (window.app) {
        window.app.handleError(event.error, 'Global');
    }
});

// Expose app methods globally for HTML onclick handlers
window.showSection = (section) => window.app?.showSection(section);
window.logout = () => window.app?.logout();
window.showAddProductModal = () => window.app?.showAddProductModal();
window.showAddCategoryModal = () => window.app?.showAddCategoryModal();
window.closeModal = (modalId) => window.app?.closeModal(modalId);
window.deleteProduct = (id) => window.app?.deleteProduct(id);
window.deleteCategory = (id) => window.app?.deleteCategory(id);
window.editProduct = (id) => window.app?.editProduct(id);
window.editCategory = (id) => window.app?.editCategory(id);
window.filterProductsByCategory = (id) => window.app?.filterProductsByCategory(id);
window.sortProducts = (sortBy, order) => window.app?.sortProducts(sortBy, order);
window.searchProducts = () => window.app?.searchProducts();
window.refreshApp = () => window.app?.refresh();