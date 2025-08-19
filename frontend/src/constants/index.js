// Constantes de l'application
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  FLASK_URL: 'http://localhost:5000',
  TIMEOUT: 30000
};

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

export const IMAGE_ANALYSIS_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export const UPLOAD_TYPES = {
  ANALYZE: 'analyze',
  STEGANOGRAPHY: 'steganography',
  VERIFY: 'verify'
};

export const FILTER_TYPES = {
  ALL: 'all',
  USER: 'user',
  STEGANOGRAPHY: 'steganography',
  AI_DETECTED: 'ai-detected'
};

export const CONFIDENCE_THRESHOLDS = {
  LOW: 0.3,
  MEDIUM: 0.7,
  HIGH: 1.0
};

export const FILE_CONSTRAINTS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  UPLOAD: '/upload',
  GALLERY: '/gallery',
  PROFILE: '/profile',
  AUTH: '/auth'
};
