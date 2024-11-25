// auth.js
class Auth {
    static getToken() {
        return localStorage.getItem('token');
    }

    static async checkAuth() {
        const token = this.getToken();
        const profileBtn = document.getElementById('profile-btn');
        const profileInitial = document.getElementById('profileInitial');

        if (!token) {
            profileInitial.style.display = 'none';
            profileBtn.onclick = () => window.location.href = 'login.html';
            return null;
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
                return data.user;
            }
            
            return null;
        } catch (error) {
            console.error('Auth check failed:', error);
            return null;
        }
    }
}

window.Auth = Auth;
