// Utilitaire pour gérer les réponses API de manière robuste
export const handleApiResponse = async (response) => {
  // Vérifier si la réponse est OK
  if (!response.ok) {
    // Essayer de lire la réponse comme JSON d'abord
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || `Erreur HTTP ${response.status}`);
      } catch (jsonError) {
        // Si le parsing JSON échoue, lire comme texte
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText || 'Erreur de serveur'}`);
      }
    } else {
      // Réponse non-JSON (probablement HTML d'erreur)
      const errorText = await response.text();
      throw new Error(`Erreur ${response.status}: ${errorText || 'Erreur de serveur'}`);
    }
  }

  // Vérifier que la réponse est en JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Réponse invalide du serveur (Content-Type non JSON)');
  }

  // Parser le JSON
  try {
    return await response.json();
  } catch (jsonError) {
    console.error('Erreur parsing JSON:', jsonError);
    throw new Error('Réponse JSON invalide du serveur');
  }
};

// Fonction pour faire des requêtes API sécurisées
export const apiRequest = async (url, options = {}) => {
  try {
    console.log(`API Request: ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error(`API Error for ${url}:`, error);
    throw error;
  }
};
