// auth.js
class Auth {
    static setToken(token) {
        localStorage.setItem('token', token);
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static removeToken() {
        localStorage.removeItem('token');
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static async getUserProfile() {
        try {
            const response = await fetch('https://adora-t8e8.onrender.com/api/user/profile', {
                headers: {
                    'auth': this.getToken()
                }
            });
            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

    static async logout() {
        this.removeToken();
        window.location.href = '/login.html';
    }
}

window.Auth = Auth;
