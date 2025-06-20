// Enhanced E-commerce Store JavaScript
// Global variables
// const API_BASE_URL = 'http://localhost:8081/api';


let currentUser = null;
let products = [];
let categories = [];
let cart = [];
let wishlist = [];
let orders = [];
let currentProductId = null;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    loadMockData();
    setupEventListeners();
    checkAuthState();
    loadProducts();
    loadCategories();
    updateUI();
    setupThemeToggle();
    setupSearchFilters();
}

// Mock data for demonstration
function loadMockData() {
    // Mock categories
    categories = [
        { id: 1, name: 'Electronics', description: 'Electronic devices and gadgets' },
        { id: 2, name: 'Clothing', description: 'Fashion and apparel' },
        { id: 3, name: 'Books', description: 'Books and literature' },
        { id: 4, name: 'Home & Garden', description: 'Home improvement and gardening' },
        { id: 5, name: 'Sports', description: 'Sports and fitness equipment' }
    ];

    // Mock products
    products = [
        {
            id: 1,
            name: 'Wireless Headphones',
            description: 'High-quality wireless headphones with noise cancellation',
            price: 199.99,
            categoryId: 1,
            stockQuantity: 50,
            imageUrl: 'https://via.placeholder.com/300x300?text=Headphones',
            rating: 4.5,
            dateAdded: new Date('2024-01-15')
        },
        {
            id: 2,
            name: 'Cotton T-Shirt',
            description: 'Comfortable 100% cotton t-shirt in various colors',
            price: 29.99,
            categoryId: 2,
            stockQuantity: 100,
            imageUrl: 'https://via.placeholder.com/300x300?text=T-Shirt',
            rating: 4.2,
            dateAdded: new Date('2024-01-20')
        },
        {
            id: 3,
            name: 'Programming Guide',
            description: 'Complete guide to modern programming techniques',
            price: 45.00,
            categoryId: 3,
            stockQuantity: 25,
            imageUrl: 'https://via.placeholder.com/300x300?text=Book',
            rating: 4.8,
            dateAdded: new Date('2024-01-10')
        },
        {
            id: 4,
            name: 'Garden Tools Set',
            description: 'Complete set of essential garden tools',
            price: 89.99,
            categoryId: 4,
            stockQuantity: 30,
            imageUrl: 'https://via.placeholder.com/300x300?text=Garden+Tools',
            rating: 4.3,
            dateAdded: new Date('2024-01-25')
        },
        {
            id: 5,
            name: 'Yoga Mat',
            description: 'Premium non-slip yoga mat for all fitness levels',
            price: 39.99,
            categoryId: 5,
            stockQuantity: 75,
            imageUrl: 'https://via.placeholder.com/300x300?text=Yoga+Mat',
            rating: 4.6,
            dateAdded: new Date('2024-01-18')
        }
    ];
}

// Event listeners setup
function setupEventListeners() {
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    document.getElementById('addCategoryForm').addEventListener('submit', handleAddCategory);
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);

    // Password strength checker
    document.getElementById('registerPassword').addEventListener('input', checkPasswordStrength);
    document.getElementById('confirmPassword').addEventListener('input', checkPasswordMatch);

    // Search functionality
    document.getElementById('quickSearchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performQuickSearch();
        }
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            toggleView(this.dataset.view);
        });
    });

    // Click outside to close dropdowns
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-dropdown')) {
            document.getElementById('userDropdownMenu').style.display = 'none';
        }
    });
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;

    // Mock authentication
    if (username && password) {
        currentUser = {
            id: 1,
            username: username,
            email: username + '@example.com',
            firstName: 'John',
            lastName: 'Doe',
            phone: '123-456-7890',
            address: '123 Main St, City, State'
        };

        showAlert('loginAlert', 'Login successful!', 'success');
        setTimeout(() => {
            showSection('products');
            updateAuthState();
        }, 1000);
    } else {
        showAlert('loginAlert', 'Please enter valid credentials', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    if (!agreeTerms) {
        showAlert('registerAlert', 'Please agree to the terms and conditions', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('registerAlert', 'Passwords do not match', 'error');
        return;
    }

    // Mock registration
    currentUser = {
        id: Date.now(),
        username: username,
        email: email,
        firstName: '',
        lastName: '',
        phone: '',
        address: ''
    };

    showAlert('registerAlert', 'Registration successful!', 'success');
    setTimeout(() => {
        showSection('products');
        updateAuthState();
    }, 1000);
}

function logout() {
    currentUser = null;
    cart = [];
    wishlist = [];
    updateAuthState();
    showSection('login');
    showNotification('Logged out successfully', 'info');
}

function checkAuthState() {
    // Check if user should be logged in (mock implementation)
    updateAuthState();
}

function updateAuthState() {
    const authButtons = document.getElementById('authButtons');
    const userInfo = document.getElementById('userInfo');
    const authRequiredElements = document.querySelectorAll('.auth-required');

    if (currentUser) {
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        document.getElementById('welcomeMessage').textContent = currentUser.username;
        
        authRequiredElements.forEach(el => el.style.display = 'block');
        
        loadUserProfile();
        loadUserOrders();
    } else {
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
        
        authRequiredElements.forEach(el => el.style.display = 'none');
    }

    updateCartCount();
    updateWishlistCount();
}

// Product management functions
function loadProducts() {
    showLoading('productsLoading', true);
    
    setTimeout(() => {
        displayProducts(products);
        populateCategoryFilter();
        showLoading('productsLoading', false);
    }, 500);
}

function displayProducts(productsToShow) {
    const container = document.getElementById('productsGrid');
    
    if (productsToShow.length === 0) {
        container.innerHTML = '<div class="no-results">No products found</div>';
        return;
    }

    container.innerHTML = productsToShow.map(product => {
        const category = categories.find(c => c.id === product.categoryId);
        const isInWishlist = wishlist.some(item => item.id === product.id);
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.imageUrl}" alt="${product.name}" onclick="showProductDetails(${product.id})">
                    <div class="product-overlay">
                        <button class="btn btn-sm btn-primary" onclick="showProductDetails(${product.id})">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-sm ${isInWishlist ? 'btn-danger' : 'btn-outline'}" onclick="toggleWishlist(${product.id})">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-category">${category ? category.name : 'Uncategorized'}</span>
                        <div class="product-rating">
                            ${generateStarRating(product.rating)}
                            <span>(${product.rating})</span>
                        </div>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <div class="product-actions">
                            <button class="btn btn-primary" onclick="addToCart(${product.id})">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                    <div class="product-stock ${product.stockQuantity < 10 ? 'low-stock' : ''}">
                        ${product.stockQuantity} in stock
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentProductId = productId;
    const category = categories.find(c => c.id === product.categoryId);
    
    document.getElementById('productDetailsTitle').textContent = product.name;
    document.getElementById('productDetailsImage').src = product.imageUrl;
    document.getElementById('productDetailsPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('productDetailsRating').innerHTML = `
        ${generateStarRating(product.rating)}
        <span>(${product.rating})</span>
    `;
    document.getElementById('productDetailsDescription').innerHTML = `
        <p>${product.description}</p>
        <p><strong>Category:</strong> ${category ? category.name : 'Uncategorized'}</p>
        <p><strong>Stock:</strong> ${product.stockQuantity} available</p>
    `;

    document.getElementById('selectedQuantity').max = product.stockQuantity;
    document.getElementById('selectedQuantity').value = 1;

    showModal('productDetailsModal');
}

function handleAddProduct(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newProduct = {
        id: Date.now(),
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        categoryId: parseInt(formData.get('categoryId')),
        stockQuantity: parseInt(formData.get('stockQuantity')),
        imageUrl: formData.get('imageUrl') || 'https://via.placeholder.com/300x300?text=Product',
        rating: 0,
        dateAdded: new Date()
    };

    products.push(newProduct);
    displayProducts(products);
    closeModal('addProductModal');
    showNotification('Product added successfully!', 'success');
    e.target.reset();
}

// Category management
function loadCategories() {
    showLoading('categoriesLoading', true);
    
    setTimeout(() => {
        displayCategories();
        showLoading('categoriesLoading', false);
    }, 300);
}

function displayCategories() {
    const container = document.getElementById('categoriesList');
    
    container.innerHTML = categories.map(category => {
        const productCount = products.filter(p => p.categoryId === category.id).length;
        
        return `
            <div class="category-card">
                <div class="category-icon">
                    <i class="fas fa-tag"></i>
                </div>
                <div class="category-info">
                    <h3>${category.name}</h3>
                    <p>${category.description}</p>
                    <div class="category-stats">
                        <span class="product-count">${productCount} products</span>
                    </div>
                </div>
                <div class="category-actions">
                    <button class="btn btn-primary" onclick="filterByCategory(${category.id})">
                        <i class="fas fa-eye"></i> View Products
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function handleAddCategory(e) {
    e.preventDefault();
    
    const newCategory = {
        id: Date.now(),
        name: document.getElementById('categoryName').value,
        description: document.getElementById('categoryDescription').value
    };

    categories.push(newCategory);
    displayCategories();
    populateCategoryFilter();
    populateProductCategorySelect();
    closeModal('addCategoryModal');
    showNotification('Category added successfully!', 'success');
    e.target.reset();
}

function filterByCategory(categoryId) {
    const filteredProducts = products.filter(p => p.categoryId === categoryId);
    showSection('products');
    displayProducts(filteredProducts);
}

// Cart management
function addToCart(productId, quantity = 1) {
    if (!currentUser) {
        showNotification('Please login to add items to cart', 'error');
        showSection('login');
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }

    updateCartDisplay();
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
}

function addToCartFromModal() {
    const quantity = parseInt(document.getElementById('selectedQuantity').value);
    addToCart(currentProductId, quantity);
    closeModal('productDetailsModal');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    updateCartCount();
    showNotification('Item removed from cart', 'info');
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartDisplay();
            updateCartCount();
        }
    }
}

function updateCartDisplay() {
    const container = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-state">Your cart is empty</div>';
        updateCartSummary();
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-image">
                <img src="${item.imageUrl}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="item-quantity">
                <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <input type="number" value="${item.quantity}" min="1" onchange="updateCartQuantity(${item.id}, this.value)">
                <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + tax + shipping;

    document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cartShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        updateCartDisplay();
        updateCartCount();
        showNotification('Cart cleared', 'info');
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    // Mock checkout process
    const order = {
        id: Date.now(),
        date: new Date(),
        items: [...cart],
        total: parseFloat(document.getElementById('cartTotal').textContent.replace('$', '')),
        status: 'Processing'
    };

    orders.push(order);
    cart = [];
    updateCartDisplay();
    updateCartCount();
    showNotification('Order placed successfully!', 'success');
    showSection('orders');
}

// Wishlist management
function toggleWishlist(productId) {
    if (!currentUser) {
        showNotification('Please login to manage wishlist', 'error');
        showSection('login');
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex !== -1) {
        wishlist.splice(existingIndex, 1);
        showNotification(`${product.name} removed from wishlist`, 'info');
    } else {
        wishlist.push(product);
        showNotification(`${product.name} added to wishlist!`, 'success');
    }

    updateWishlistDisplay();
    updateWishlistCount();
    displayProducts(products); // Refresh product display to update heart icons
}

function toggleWishlistFromModal() {
    toggleWishlist(currentProductId);
}

function updateWishlistDisplay() {
    const container = document.getElementById('wishlistItems');
    
    if (wishlist.length === 0) {
        container.innerHTML = '<div class="empty-state">Your wishlist is empty</div>';
        return;
    }

    container.innerHTML = wishlist.map(product => {
        const category = categories.find(c => c.id === product.categoryId);
        
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.imageUrl}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-category">${category ? category.name : 'Uncategorized'}</div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="btn btn-danger" onclick="toggleWishlist(${product.id})">
                            <i class="fas fa-heart-broken"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateWishlistCount() {
    document.getElementById('wishlistCount').textContent = wishlist.length;
}

function clearWishlist() {
    if (confirm('Are you sure you want to clear your wishlist?')) {
        wishlist = [];
        updateWishlistDisplay();
        updateWishlistCount();
        showNotification('Wishlist cleared', 'info');
    }
}

// Search and filter functions
function setupSearchFilters() {
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    
    minPrice.addEventListener('input', updatePriceDisplay);
    maxPrice.addEventListener('input', updatePriceDisplay);
    
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('sortBy').addEventListener('change', applyFilters);
}

function updatePriceDisplay() {
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    
    document.getElementById('minPriceDisplay').textContent = minPrice;
    document.getElementById('maxPriceDisplay').textContent = maxPrice;
    
    applyFilters();
}

function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    let filteredProducts = products;

    if (searchTerm) {
        filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }

    applyFiltersToProducts(filteredProducts);
}

function performQuickSearch() {
    const searchTerm = document.getElementById('quickSearchInput').value.toLowerCase();
    if (searchTerm) {
        showSection('products');
        document.getElementById('searchInput').value = searchTerm;
        searchProducts();
    }
}

function applyFilters() {
    applyFiltersToProducts(products);
}

function applyFiltersToProducts(baseProducts) {
    let filteredProducts = [...baseProducts];
    
    // Apply category filter
    const categoryFilter = document.getElementById('categoryFilter').value;
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(p => p.categoryId == categoryFilter);
    }
    
    // Apply price range filter
    const minPrice = parseFloat(document.getElementById('minPrice').value);
    const maxPrice = parseFloat(document.getElementById('maxPrice').value);
    filteredProducts = filteredProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);
    
    // Apply sorting
    const sortBy = document.getElementById('sortBy').value;
    switch (sortBy) {
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
    }
    
    displayProducts(filteredProducts);
}

function populateCategoryFilter() {
    const select = document.getElementById('categoryFilter');
    select.innerHTML = '<option value="">All Categories</option>' +
        categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
}

function populateProductCategorySelect() {
    const select = document.getElementById('productCategory');
    select.innerHTML = '<option value="">Select Category</option>' +
        categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
}

// User profile and orders
function loadUserProfile() {
    if (!currentUser) return;
    
    document.getElementById('profileUsername').value = currentUser.username;
    document.getElementById('profileEmail').value = currentUser.email;
    document.getElementById('profileFirstName').value = currentUser.firstName;
    document.getElementById('profileLastName').value = currentUser.lastName;
    document.getElementById('profilePhone').value = currentUser.phone;
    document.getElementById('profileAddress').value = currentUser.address;
}

function handleProfileUpdate(e) {
    e.preventDefault();
    
    currentUser.email = document.getElementById('profileEmail').value;
    currentUser.firstName = document.getElementById('profileFirstName').value;
    currentUser.lastName = document.getElementById('profileLastName').value;
    currentUser.phone = document.getElementById('profilePhone').value;
    currentUser.address = document.getElementById('profileAddress').value;
    
    showNotification('Profile updated successfully!', 'success');
}

function loadUserOrders() {
    const container = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        container.innerHTML = '<div class="empty-state">No orders found</div>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">Order #${order.id}</div>
                <div class="order-date">${order.date.toLocaleDateString()}</div>
                <div class="order-status status-${order.status.toLowerCase()}">${order.status}</div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.imageUrl}" alt="${item.name}">
                        <div class="item-info">
                            <div class="item-name">${item.name}</div>
                            <div class="item-quantity">Qty: ${item.quantity}</div>
                        </div>
                        <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">Total: $${order.total.toFixed(2)}</div>
        </div>
    `).join('');

    // Update profile stats
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalSpent').textContent = `$${totalSpent.toFixed(2)}`;
}

// UI utility functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Load section-specific data
    switch (sectionId) {
        case 'cart':
            updateCartDisplay();
            break;
        case 'wishlist':
            updateWishlistDisplay();
            break;
        case 'orders':
            loadUserOrders();
            break;
        case 'categories':
            loadCategories();
            break;
    }
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showAddProductModal() {
    populateProductCategorySelect();
    showModal('addProductModal');
}

function showAddCategoryModal() {
    showModal('addCategoryModal');
}

function showAlert(containerId, message, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

function showNotification(message, type) {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function showLoading(loadingId, show) {
    document.getElementById(loadingId).style.display = show ? 'block' : 'none';
}

// function toggleView(view) {
//     const container = document.getElementById('productsGrid');
//     const buttons = document.querySelectorAll('.view-btn');
    
//     buttons.forEach(btn => btn.classList.remove('active'));
//     document.querySelector(`[data-view="${view}"]);
// }