// Service API dédié pour l'application Flask
import { handleApiResponse, apiRequest } from '../utils/apiUtils';

const FLASK_BASE_URL = '/flask'; // Utilise le proxy Flask

// Service Flask pour la stéganographie et détection IA
export const flaskImageService = {
  async uploadAndAnalyzeImage(file, options = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Paramètres optionnels pour l'analyse
      const queryParams = new URLSearchParams();
      if (options.skipAnalysis) queryParams.append('skip_analysis', 'true');
      if (options.onlyCheckSimilar) queryParams.append('only_check_similar', 'true');

      const url = `${FLASK_BASE_URL}/upload${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });

      return await handleApiResponse(response);
    } catch (error) {
      console.error('Erreur upload Flask:', error);
      throw error;
    }
  },

  async addSteganography(file, signature = '') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (signature) {
        formData.append('signature', signature);
      }

      const response = await fetch(`${FLASK_BASE_URL}/add_steganography`, {
        method: 'POST',
        body: formData
      });

      return await handleApiResponse(response);
    } catch (error) {
      console.error('Erreur ajout stéganographie Flask:', error);
      throw error;
    }
  },

  async verifyIntegrity(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${FLASK_BASE_URL}/verify_integrity`, {
        method: 'POST',
        body: formData
      });

      return await handleApiResponse(response);
    } catch (error) {
      console.error('Erreur vérification intégrité Flask:', error);
      throw error;
    }
  },

  async getAllFlaskImages(page = 1, perPage = 10) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString()
      });

      return apiRequest(`${FLASK_BASE_URL}/images?${queryParams.toString()}`);
    } catch (error) {
      console.error('Erreur récupération images Flask:', error);
      throw error;
    }
  },

  async getFlaskUploadedFile(filename) {
    return `${FLASK_BASE_URL}/uploads/${filename}`;
  },

  async testFlaskConnection() {
    try {
      return apiRequest(`${FLASK_BASE_URL}/test`);
    } catch (error) {
      console.error('Erreur test Flask:', error);
      throw error;
    }
  }
};

export default flaskImageService;
