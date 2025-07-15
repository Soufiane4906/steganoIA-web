import { FILE_CONSTRAINTS, CONFIDENCE_THRESHOLDS } from '../constants';

// Utilitaires pour la validation des fichiers
export const fileUtils = {
  validateFile(file) {
    if (!file) {
      throw new Error('Aucun fichier sélectionné');
    }

    if (file.size > FILE_CONSTRAINTS.MAX_SIZE) {
      throw new Error(`Le fichier dépasse la taille maximale de ${FILE_CONSTRAINTS.MAX_SIZE / 1024 / 1024}MB`);
    }

    if (!FILE_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Type de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP');
    }

    return true;
  },

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }
};

// Utilitaires pour l'analyse d'images
export const analysisUtils = {
  getConfidenceLevel(confidence) {
    if (confidence < CONFIDENCE_THRESHOLDS.LOW) return 'low';
    if (confidence < CONFIDENCE_THRESHOLDS.MEDIUM) return 'medium';
    return 'high';
  },

  getConfidenceLabel(confidence) {
    const level = this.getConfidenceLevel(confidence);
    switch (level) {
      case 'low': return 'Faible';
      case 'medium': return 'Moyenne';
      case 'high': return 'Élevée';
      default: return 'Inconnue';
    }
  },

  getConfidenceColor(confidence) {
    const level = this.getConfidenceLevel(confidence);
    switch (level) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#dc3545';
      default: return '#6c757d';
    }
  },

  formatConfidence(confidence) {
    return `${(confidence * 100).toFixed(1)}%`;
  }
};

// Utilitaires pour les dates
export const dateUtils = {
  formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  },

  getRelativeTime(dateString) {
    if (!dateString) return 'N/A';
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    return this.formatDate(dateString);
  }
};

// Utilitaires pour l'authentification
export const authUtils = {
  // TODO: Remplacer par un vrai système d'authentification
  getCurrentUser() {
    return {
      username: 'user',
      role: 'USER'
    };
  },

  isAdmin() {
    return this.getCurrentUser().role === 'ADMIN';
  },

  canDeleteImage(image) {
    const currentUser = this.getCurrentUser();
    return currentUser.username === image.user?.username || this.isAdmin();
  },

  canViewAllImages() {
    return this.isAdmin();
  }
};

// Utilitaires pour l'interface utilisateur
export const uiUtils = {
  getStatusIcon(status) {
    switch (status?.toLowerCase()) {
      case 'completed': return '✅';
      case 'pending': return '⏳';
      case 'failed': return '❌';
      default: return '❓';
    }
  },

  getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'completed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'failed': return '#dc3545';
      default: return '#6c757d';
    }
  },

  truncateText(text, maxLength = 50) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  },

  copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback pour les navigateurs plus anciens
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Erreur lors de la copie:', err);
      }
      document.body.removeChild(textArea);
    }
  }
};
