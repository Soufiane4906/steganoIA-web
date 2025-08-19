import { FILE_CONSTRAINTS, CONFIDENCE_THRESHOLDS } from '../constants';
import {
  Security,
  Visibility,
  Image as ImageIcon,
  DataUsage,
  Assessment,
  Memory,
  Palette,
  AspectRatio,
  Storage,
  AccessTime
} from '@mui/icons-material';

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
  },

  getAnalysisItems(stegano_properties = {}, metadata = {}, visual_properties = {}) {
    const items = [];

    // Propriétés stéganographiques
    if (stegano_properties.steganography_confidence !== undefined) {
      items.push({
        icon: <Security />,
        label: 'Probabilité de stéganographie',
        value: this.formatConfidence(stegano_properties.steganography_confidence),
        unit: null
      });
    }

    if (stegano_properties.hidden_data_size !== undefined) {
      items.push({
        icon: <DataUsage />,
        label: 'Taille estimée des données cachées',
        value: stegano_properties.hidden_data_size,
        unit: 'bytes'
      });
    }

    if (stegano_properties.embedding_method) {
      items.push({
        icon: <Memory />,
        label: 'Méthode d\'embedding détectée',
        value: stegano_properties.embedding_method,
        unit: null
      });
    }

    // Métadonnées
    if (metadata.file_size !== undefined) {
      items.push({
        icon: <Storage />,
        label: 'Taille du fichier',
        value: metadata.file_size,
        unit: 'bytes'
      });
    }

    if (metadata.format) {
      items.push({
        icon: <ImageIcon />,
        label: 'Format de l\'image',
        value: metadata.format,
        unit: null
      });
    }

    if (metadata.creation_date) {
      items.push({
        icon: <AccessTime />,
        label: 'Date de création',
        value: metadata.creation_date,
        unit: 'date'
      });
    }

    // Propriétés visuelles
    if (visual_properties.width && visual_properties.height) {
      items.push({
        icon: <AspectRatio />,
        label: 'Dimensions',
        value: `${visual_properties.width} × ${visual_properties.height}`,
        unit: 'pixels'
      });
    }

    if (visual_properties.color_depth !== undefined) {
      items.push({
        icon: <Palette />,
        label: 'Profondeur de couleur',
        value: visual_properties.color_depth,
        unit: 'bits'
      });
    }

    if (visual_properties.compression_ratio !== undefined) {
      items.push({
        icon: <Assessment />,
        label: 'Ratio de compression',
        value: visual_properties.compression_ratio.toFixed(2),
        unit: null
      });
    }

    if (visual_properties.noise_level !== undefined) {
      items.push({
        icon: <Visibility />,
        label: 'Niveau de bruit',
        value: this.formatConfidence(visual_properties.noise_level),
        unit: null
      });
    }

    return items;
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
  },

  formatRelativeTime(isoString) {
    if (!isoString) return 'Date inconnue';

    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }

    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const months = Math.round(days / 30);
    const years = Math.round(days / 365);

    if (seconds < 60) {
      return "à l'instant";
    } else if (minutes < 60) {
      return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (hours < 24) {
      return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (days < 30) {
      return `il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else if (months < 12) {
      return `il y a ${months} mois`;
    } else {
      return `il y a ${years} an${years > 1 ? 's' : ''}`;
    }
  },
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
