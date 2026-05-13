/**
 * Core Constants and Configuration
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || '/api/v1',
  TIMEOUT_MS: parseInt(import.meta.env.VITE_API_TIMEOUT_MS || '10000', 10),
  USE_MOCKS: import.meta.env.VITE_USE_MOCKS === 'true',
  MOCK_SCENARIO: import.meta.env.VITE_MOCK_SCENARIO || 'SUCCESS',
};

export const LANGUAGE_CONFIG = {
  DEFAULT: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
  SUPPORTED: ['en', 'pt-BR', 'es'],
  STORAGE_KEY: 'kiosk-language',
};

export const KIOSK_CONFIG = {
  KIOSK_ID: 1,
  ENVIRONMENT: import.meta.env.MODE,
  DEBUG: import.meta.env.MODE === 'development',
};

// Validation patterns
export const VALIDATION_PATTERNS = {
  RESERVATION_CODE: /^RSV-\d{4}-\d{4}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\d\s\-\+\(\)]{10,20}$/,
};

// UI Constants
export const UI_CONFIG = {
  BUTTON_MIN_HEIGHT: '60px',
  TOUCH_TARGET_MIN: '50px',
  ANIMATION_DURATION_MS: 300,
};
