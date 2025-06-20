// ui.js - UI Manager
class UIManager {
    constructor() {
        this.currentSection = 'login';
    }

    // Show specific section
    showSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => section.classList.remove('active'));

        // Show requested section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }
    }

    // Update authentication UI state
    updateAuthUI(isAuthenticated, username = '') {
        const userInfo = document.getElementById('userInfo');
        const authButtons = document.getElementById('authButtons');
        const welcomeMessage = document.getElementById('welcomeMessage');

        if (isAuthenticated) {
            userInfo.style.display = 'flex';
            authButtons.style.display = 'none';
            welcomeMessage.textContent = `Welcome, ${username}!`;
        } else {
            userInfo.style.display = 'none';
            authButtons.style.display = 'flex';
        }
    }

    // Show alert message
    showAlert(elementId, message, type = 'info') {
        const alertElement = document.getElementById(elementId);
        if (alertElement) {
            alertElement.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
            
            // Auto-hide success/info alerts
            if (type === 'success' || type === 'info') {
                setTimeout(() => {
                    alertElement.innerHTML = '';
                }, 5000);
            }
        }
    }

    // Clear alert
    clearAlert(elementId) {
        const alertElement = document.getElementById(elementId);
        if (alertElement) {
            alertElement.innerHTML = '';
        }
    }

    // Show loading state
    showLoading(elementId) {
        const loadingElement = document.getElementById(elementId);
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }
    }

    // Hide loading state
    hideLoading(elementId) {
        const loadingElement = document.getElementById(elementId);
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    // Display products in grid
    displayProducts(products) {
        const grid = document.getElementById('productsGrid');
        
        if (!grid) return;

        if (products.length === 0) {
            grid.innerHTML = '<div style="text-align: center; color: #666; grid-column: 1/-1;">No products found.</div>';
            return;
        }

        grid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    ${product.imageUrl ? 
                        `<img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">` : 
                        '📦'
                    }
                </div>
                <div class="product-name">${this.escapeHtml(product.name)}</div>
                <div class="product-price">$${product.price}</div>
                <div class="product-stock">Stock: ${product.stockQuantity}</div>
                <p style="color: #666; margin-bottom: 15px;">${this.escapeHtml(product.description || 'No description available')}</p>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-primary" onclick="app.editProduct(${product.id})">Edit</button>
                    <button class="btn btn-danger" onclick="app.deleteProduct(${product.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Display categories
    displayCategories(categories) {
        const list = document.getElementById('categoriesList');
        
        if (!list) return;

        if (categories.length === 0) {
            list.innerHTML = '<div style="text-align: center; color: #666;">No categories found.</div>';
            return;
        }

        list.innerHTML = categories.map(category => `
            <div class="card">
                <h3>${this.escapeHtml(category.name)}</h3>
                <p style="color: #666; margin-bottom: 15px;">${this.escapeHtml(category.description || 'No description available')}</p>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-primary" onclick="app.editCategory(${category.id})">Edit</button>
                    <button class="btn btn-danger" onclick="app.deleteCategory(${category.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Populate category dropdown
    populateCategoryDropdown(categories) {
        const select = document.getElementById('productCategory');
        if (!select) return;

        select.innerHTML = '<option value="">Select Category</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    }

    // Show modal
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    }

    // Close modal
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Clear form
    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    }

    // Get form data
    getFormData(formId) {
        const form = document.getElementById(formId);
        if (!form) return {};

        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    // Set form data
    setFormData(formId, data) {
        const form = document.getElementById(formId);
        if (!form) return;

        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"], #${key}`);
            if (input) {
                input.value = data[key] || '';
            }
        });
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // Show confirmation dialog
    showConfirmation(message) {
        return confirm(message);
    }

    // Enable/disable element
    setElementEnabled(elementId, enabled) {
        const element = document.getElementById(elementId);
        if (element) {
            element.disabled = !enabled;
        }
    }

    // Set element visibility
    setElementVisible(elementId, visible) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = visible ? 'block' : 'none';
        }
    }
}