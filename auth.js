// auth.js
class Auth {
    static isAuthenticated() {
        return localStorage.getItem('token') !== null;
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static setToken(token) {
        localStorage.setItem('token', token);
    }

    static logout() {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    }

    static async checkAuthStatus() {
        const token = this.getToken();
        const profileBtn = document.getElementById('profile-btn');
        const profileInitial = document.getElementById('profileInitial');

        if (!token) {
            profileInitial.style.display = 'none';
            profileBtn.onclick = () => window.location.href = 'login.html';
            return false;
        }

        try {
            const response = await fetch('https://adora-t8e8.onrender.com/api/user/profile', {
                headers: {
                    'Auth': token
                }
            });
            
            const data = await response.json();
            
            if (data.user) {
                profileInitial.style.display = 'flex';
                profileInitial.textContent = data.user.name[0].toUpperCase();
                profileBtn.onclick = () => window.location.href = 'profile.html';
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Auth check failed:', error);
            return false;
        }
    }
}

// Initialize auth check when the page loads
document.addEventListener('DOMContentLoaded', () => {
    Auth.checkAuthStatus();
});

// Export the Auth class
window.Auth = Auth;
