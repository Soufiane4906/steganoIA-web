// Services d'API pour communiquer avec le backend Spring Boot via le proxy Vite
import { authService } from './authService';
import { handleApiResponse, apiRequest } from '../utils/apiUtils';

const API_BASE_URL = '/api'; // Utilise le proxy Vite vers Spring Boot (port 8080)

// Utilitaire pour l'authentification avec JWT
const getAuthHeaders = () => {
  return authService.getAuthHeaders();
};

// Service d'API pour les utilisateurs
export const userService = {
  async getAllUsers() {
    return apiRequest(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders()
    });
  },

  async getUserById(id) {
    return apiRequest(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders()
    });
  },

  async createUser(userData) {
    return apiRequest(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
  },

  async deleteUser(id) {
    return apiRequest(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  }
};

// Service d'API pour les images Spring Boot
export const imageService = {
  async uploadAndAnalyzeImage(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': authService.getToken() ? `Bearer ${authService.getToken()}` : ''
        },
        body: formData
      });

      return await handleApiResponse(response);
    } catch (error) {
      console.error('Erreur upload image:', error);
      throw error;
    }
  },

  async addSteganography(file, signature) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (signature) {
        formData.append('signature', signature);
      }

      const response = await fetch(`${API_BASE_URL}/images/steganography`, {
        method: 'POST',
        headers: {
          'Authorization': authService.getToken() ? `Bearer ${authService.getToken()}` : ''
        },
        body: formData
      });

      return await handleApiResponse(response);
    } catch (error) {
      console.error('Erreur ajout stéganographie:', error);
      throw error;
    }
  },

  async verifyIntegrity(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/images/verify`, {
        method: 'POST',
        headers: {
          'Authorization': authService.getToken() ? `Bearer ${authService.getToken()}` : ''
        },
        body: formData
      });

      return await handleApiResponse(response);
    } catch (error) {
      console.error('Erreur vérification intégrité:', error);
      throw error;
    }
  },

  async getUserImages() {
    return apiRequest(`${API_BASE_URL}/images/my-images`, {
      headers: getAuthHeaders()
    });
  },

  async getAllImages() {
    return apiRequest(`${API_BASE_URL}/images`, {
      headers: getAuthHeaders()
    });
  },

  async getImagesWithSteganography() {
    return apiRequest(`${API_BASE_URL}/images/steganography`, {
      headers: getAuthHeaders()
    });
  },

  async getAiDetectedImages(threshold = 0.7) {
    return apiRequest(`${API_BASE_URL}/images/ai-detected?threshold=${threshold}`, {
      headers: getAuthHeaders()
    });
  },

  async deleteImage(id) {
    return apiRequest(`${API_BASE_URL}/images/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
  },

  async testFlaskConnection() {
    return apiRequest(`${API_BASE_URL}/images/test-flask`);
  }
};
