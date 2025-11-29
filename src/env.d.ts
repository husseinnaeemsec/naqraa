/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Environment Configuration
  readonly VITE_NODE_ENV: 'development' | 'staging' | 'production'
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string

  // API Configuration
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_API_RETRY_ATTEMPTS: string

  // Authentication
  readonly VITE_AUTH_TOKEN_KEY: string
  readonly VITE_AUTH_REFRESH_KEY: string
  readonly VITE_AUTH_SESSION_TIMEOUT: string

  // Feature Flags
  readonly VITE_ENABLE_CHAT: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
  readonly VITE_ENABLE_DARK_MODE: string
  readonly VITE_ENABLE_PWA: string
  readonly VITE_ENABLE_ANALYTICS: string

  // Exlcude from auth check 
  readonly VITE_EXCLUDE_AUTH_CHECK:string[];
  // UI Configuration
  readonly VITE_DEFAULT_LANGUAGE: string
  readonly VITE_SUPPORTED_LANGUAGES: string
  readonly VITE_RTL_LANGUAGES: string
  readonly VITE_PAGINATION_SIZE: string
  readonly VITE_DEBOUNCE_MS: string

  // File Upload
  readonly VITE_MAX_FILE_SIZE: string
  readonly VITE_ALLOWED_FILE_TYPES: string

  // External Services
  readonly VITE_GOOGLE_ANALYTICS_ID: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_INTERCOM_APP_ID: string

  // Development Tools
  readonly VITE_ENABLE_DEV_TOOLS: string
  readonly VITE_ENABLE_REDUX_DEVTOOLS: string
  readonly VITE_LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'

  // CDN & Assets
  readonly VITE_CDN_URL: string
  readonly VITE_STATIC_URL: string

  // Social Auth
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_FACEBOOK_APP_ID: string

  // Email Configuration
  readonly VITE_SUPPORT_EMAIL: string
  readonly VITE_CONTACT_EMAIL: string

  // App Store Links
  readonly VITE_APP_STORE_URL: string
  readonly VITE_GOOGLE_PLAY_URL: string

  // WebSocket Configuration
  readonly VITE_WS_URL: string
  readonly VITE_WS_RECONNECT_INTERVAL: string

  // Security
  readonly VITE_ENABLE_CSP: string
  readonly VITE_ALLOWED_HOSTS: string

  // Performance
  readonly VITE_ENABLE_BUNDLE_ANALYZER: string
  readonly VITE_ENABLE_COMPRESSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}