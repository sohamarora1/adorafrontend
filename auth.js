// auth.js
class Auth {
    static TOKEN_KEY = 'token';
    static PROFILE_KEY = 'userProfile';

    static setToken(token) {
        try {
            // Validate token before storing
            if (!token || typeof token !== 'string') {
                throw new Error('Invalid token format');
            }
            
            // Optional: Add token expiration logic
            const tokenData = {
                token: token,
                timestamp: Date.now()
            };

            localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));
            
            // Debug log
            console.log('Token set successfully');
        } catch (error) {
            console.error('Error setting token:', error);
        }
    }

    static getToken() {
        try {
            const storedTokenData = localStorage.getItem(this.TOKEN_KEY);
            
            if (!storedTokenData) return null;

            const { token, timestamp } = JSON.parse(storedTokenData);

            // Optional: Token expiration check (e.g., 7 days)
            const TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
            if (Date.now() - timestamp > TOKEN_EXPIRATION) {
                this.removeToken();
                return null;
            }

            return token;
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    }

    static removeToken() {
        try {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.PROFILE_KEY);
            
            // Debug log
            console.log('Token and profile removed');
        } catch (error) {
            console.error('Error removing token:', error);
        }
    }

    static isAuthenticated() {
        const token = this.getToken();
        return !!token;
    }

    static async getUserProfile() {
        try {
            // First, check if profile is cached
            const cachedProfile = localStorage.getItem(this.PROFILE_KEY);
            if (cachedProfile) {
                return JSON.parse(cachedProfile);
            }

            // If not cached, fetch from server
            const token = this.getToken();
            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await fetch('https://adora-t8e8.onrender.com/api/user/profile', {
                method: 'GET',
                headers: {
                    'auth': token,
                    'Content-Type': 'application/json'
                }
            });

            // Check response status
            if (!response.ok) {
                // Handle different error scenarios
                if (response.status === 401) {
                    throw new Error('Unauthorized: Token might be invalid');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Validate response
            if (!data.user) {
                throw new Error('No user data received');
            }

            // Cache user profile
            localStorage.setItem(this.PROFILE_KEY, JSON.stringify(data.user));

            return data.user;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            
            // If token is invalid, remove it
            if (error.message.includes('Unauthorized')) {
                this.removeToken();
            }

            return null;
        }
    }

    static async refreshToken() {
        try {
            const token = this.getToken();
            if (!token) return null;

            const response = await fetch('https://adora-t8e8.onrender.com/api/user/refresh-token', {
                method: 'POST',
                headers: {
                    'auth': token,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const data = await response.json();
            
            // Update token
            this.setToken(data.newToken);

            return data.newToken;
        } catch (error) {
            console.error('Token refresh error:', error);
            this.removeToken();
            return null;
        }
    }

    static async logout() {
        try {
            // Optional: Call backend logout endpoint
            const token = this.getToken();
            await fetch('https://adora-t8e8.onrender.com/api/user/logout', {
                method: 'POST',
                headers: {
                    'auth': token,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always remove token and redirect
            this.removeToken();
            window.location.href = '/login.html';
        }
    }

    // Utility method to protect routes
    static protectRoute() {
        if (!this.isAuthenticated()) {
            // Store current URL for redirection after login
            localStorage.setItem('redirectUrl', window.location.href);
            window.location.href = '/login.html';
            return false;
        }
        return true;
    }
}

// Attach to window for global access
window.Auth = Auth;

// Optional: Add event listener for token-related events
window.addEventListener('storage', (event) => {
    if (event.key === Auth.TOKEN_KEY) {
        // Token changed in another tab/window
        if (!event.newValue) {
            // Token removed, likely logged out
            window.location.href = '/login.html';
        }
    }
});
