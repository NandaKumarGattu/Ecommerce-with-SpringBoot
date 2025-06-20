// auth.js - Authentication Service
class AuthService {
    constructor(apiBaseUrl) {
        this.API_BASE_URL = apiBaseUrl;
        this.authToken = localStorage.getItem('authToken');
        this.currentUser = localStorage.getItem('currentUser');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!(this.authToken && this.currentUser);
    }

    // Get current user info
    getCurrentUser() {
        return this.currentUser;
    }

    // Get auth token
    getToken() {
        return this.authToken;
    }

    // Login user
    async login(username, password) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.authToken = data.token;
                this.currentUser = data.username;
                localStorage.setItem('authToken', this.authToken);
                localStorage.setItem('currentUser', this.currentUser);
                
                return { success: true, data };
            } else {
                return { success: false, error: data.error || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    }

    // Register new user
    async register(username, email, password) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                return { success: true, message: 'Registration successful! You can now login.' };
            } else {
                return { success: false, error: data.error || 'Registration failed' };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Network error. Please try again.' };
        }
    }

    // Logout user
    logout() {
        this.authToken = null;
        this.currentUser = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    }

    // Get authorization headers
    getAuthHeaders() {
        return this.authToken ? {
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        };
    }
}