// Service d'authentification avec JWT
const API_BASE_URL = '/api';

class AuthService {
  constructor() {
    this.TOKEN_KEY = 'stegano_auth_token';
    this.USER_KEY = 'stegano_user';
  }

  // Login
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // Vérifier si la réponse est en JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          throw new Error(error.error || `Erreur HTTP ${response.status}`);
        } else {
          // Si ce n'est pas du JSON, lire comme texte
          const errorText = await response.text();
          throw new Error(`Erreur ${response.status}: ${errorText || 'Erreur de connexion'}`);
        }
      }

      // Vérifier que la réponse est bien en JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Réponse invalide du serveur (pas de JSON)');
      }

      const data = await response.json();

      // Stocker le token et les infos utilisateur
      localStorage.setItem(this.TOKEN_KEY, data.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify({
        username: data.username,
        role: data.role
      }));

      return data;

    } catch (error) {
      console.error('Erreur login:', error);
      throw error;
    }
  }

  // Logout
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    // Appeler l'API pour invalidation côté serveur
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    }).catch(() => {}); // Ignore les erreurs lors du logout
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }

  // Récupérer le token
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Récupérer les infos utilisateur
  getCurrentUser() {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Vérifier si l'utilisateur est admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'ADMIN';
  }

  // Headers d'authentification
  getAuthHeaders() {
    const token = this.getToken();
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    } : {
      'Content-Type': 'application/json',
    };
  }

  // Vérifier si le token est expiré
  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  // Récupérer le profil utilisateur depuis l'API
  async getCurrentUserProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du profil');
    }

    return response.json();
  }

  // Refresh automatique du token si nécessaire
  async refreshTokenIfNeeded() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const timeLeft = payload.exp * 1000 - Date.now();

      // Si le token expire dans moins de 10 minutes, on pourrait le rafraîchir
      if (timeLeft < 10 * 60 * 1000) {
        // Pour l'instant, on déconnecte l'utilisateur
        // Dans une version future, on pourrait implémenter un refresh token
        this.logout();
        return false;
      }

      return true;
    } catch {
      this.logout();
      return false;
    }
  }
}

export const authService = new AuthService();
