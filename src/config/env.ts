/**
 * Environment Configuration Utility
 * Provides type-safe access to environment variables with defaults
 */

export interface AppConfig {
  // Environment
  nodeEnv: 'development' | 'staging' | 'production'
  appName: string
  appVersion: string

  // API
  apiUrl: string
  apiTimeout: number
  apiRetryAttempts: number

  // Authentication
  authTokenKey: string
  authRefreshKey: string
  authSessionTimeout: number

  // Features
  features: {
    chat: boolean
    notifications: boolean
    darkMode: boolean
    pwa: boolean
    analytics: boolean
  }

  // UI
  ui: {
    defaultLanguage: string
    supportedLanguages: string[]
    rtlLanguages: string[]
    paginationSize: number
    debounceMs: number
  }

  // File Upload
  fileUpload: {
    maxSize: number
    allowedTypes: string[]
  }

  // External Services
  external: {
    googleAnalyticsId?: string
    sentryDsn?: string
    intercomAppId?: string
    googleClientId?: string
    facebookAppId?: string
  }

  // Development
  dev: {
    enableDevTools: boolean
    enableReduxDevtools: boolean
    logLevel: 'debug' | 'info' | 'warn' | 'error'
  }

  // URLs
  urls: {
    cdnUrl?: string
    staticUrl: string
    wsUrl: string
    supportEmail: string
    contactEmail: string
    appStoreUrl?: string
    googlePlayUrl?: string
  }

  // WebSocket
  ws: {
    url: string
    reconnectInterval: number
  }

  // Security
  security: {
    enableCsp: boolean
    allowedHosts: string[]
  }

  // Performance
  performance: {
    enableBundleAnalyzer: boolean
    enableCompression: boolean
  }

  excludeAuthCheck:string[];
}

// Helper function to convert string to boolean
const toBool = (value: string = 'false'): boolean => {
  return value.toLowerCase() === 'true'
}

// Helper function to convert string to number
const toNumber = (value: string, defaultValue: number): number => {
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

// Helper function to convert comma-separated string to array
const toArray = (value: string): string[] => {
  return value ? value.split(',').map(item => item.trim()) : []
}

// Create configuration object from environment variables
export const config: AppConfig = {
  // Environment
  nodeEnv: (import.meta.env.VITE_NODE_ENV as AppConfig['nodeEnv']) || 'development',
  appName: import.meta.env.VITE_APP_NAME || 'Naqraa',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // API
  apiUrl: import.meta.env.VITE_API_URL,
  apiTimeout: toNumber(import.meta.env.VITE_API_TIMEOUT, 30000),
  apiRetryAttempts: toNumber(import.meta.env.VITE_API_RETRY_ATTEMPTS, 3),

  // Authentication
  authTokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'access_token',
  authRefreshKey: import.meta.env.VITE_AUTH_REFRESH_KEY || 'refresh_token',
  authSessionTimeout: toNumber(import.meta.env.VITE_AUTH_SESSION_TIMEOUT, 3600000),

  // Features
  features: {
    chat: toBool(import.meta.env.VITE_ENABLE_CHAT),
    notifications: toBool(import.meta.env.VITE_ENABLE_NOTIFICATIONS),
    darkMode: toBool(import.meta.env.VITE_ENABLE_DARK_MODE),
    pwa: toBool(import.meta.env.VITE_ENABLE_PWA),
    analytics: toBool(import.meta.env.VITE_ENABLE_ANALYTICS),
  },

  // UI
  ui: {
    defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE || 'ar',
    supportedLanguages: toArray(import.meta.env.VITE_SUPPORTED_LANGUAGES || 'ar,en,ku'),
    rtlLanguages: toArray(import.meta.env.VITE_RTL_LANGUAGES || 'ar,ku'),
    paginationSize: toNumber(import.meta.env.VITE_PAGINATION_SIZE, 12),
    debounceMs: toNumber(import.meta.env.VITE_DEBOUNCE_MS, 300),
  },

  // File Upload
  fileUpload: {
    maxSize: toNumber(import.meta.env.VITE_MAX_FILE_SIZE, 10485760), // 10MB
    allowedTypes: toArray(import.meta.env.VITE_ALLOWED_FILE_TYPES || 'pdf,doc,docx,ppt,pptx,jpg,jpeg,png,gif'),
  },

  // External Services
  external: {
    googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || undefined,
    sentryDsn: import.meta.env.VITE_SENTRY_DSN || undefined,
    intercomAppId: import.meta.env.VITE_INTERCOM_APP_ID || undefined,
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || undefined,
    facebookAppId: import.meta.env.VITE_FACEBOOK_APP_ID || undefined,
  },

  // Development
  dev: {
    enableDevTools: toBool(import.meta.env.VITE_ENABLE_DEV_TOOLS),
    enableReduxDevtools: toBool(import.meta.env.VITE_ENABLE_REDUX_DEVTOOLS),
    logLevel: (import.meta.env.VITE_LOG_LEVEL as AppConfig['dev']['logLevel']) || 'info',
  },

  // URLs
  urls: {
    cdnUrl: import.meta.env.VITE_CDN_URL || undefined,
    staticUrl: import.meta.env.VITE_STATIC_URL || '/',
    wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws',
    supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'support@naqraa.com',
    contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'contact@naqraa.com',
    appStoreUrl: import.meta.env.VITE_APP_STORE_URL || undefined,
    googlePlayUrl: import.meta.env.VITE_GOOGLE_PLAY_URL || undefined,
  },

  // WebSocket
  ws: {
    url: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws',
    reconnectInterval: toNumber(import.meta.env.VITE_WS_RECONNECT_INTERVAL, 5000),
  },

  // Security
  security: {
    enableCsp: toBool(import.meta.env.VITE_ENABLE_CSP),
    allowedHosts: toArray(import.meta.env.VITE_ALLOWED_HOSTS || 'localhost,127.0.0.1'),
  },

  // Performance
  performance: {
    enableBundleAnalyzer: toBool(import.meta.env.VITE_ENABLE_BUNDLE_ANALYZER),
    enableCompression: toBool(import.meta.env.VITE_ENABLE_COMPRESSION),
  },

  // Don't check authentication for thesev paths
  excludeAuthCheck: import.meta.env.VITE_EXCLUDE_AUTH_CHECK || ['/login', '/register']
}


// Export individual config sections for convenience
export const { 
  nodeEnv, 
  apiUrl, 
  features, 
  ui, 
  fileUpload, 
  external, 
  dev, 
  urls, 
  ws, 
  security, 
  performance 
} = config

// Helper functions for common checks
export const isDevelopment = nodeEnv === 'development'
export const isStaging = nodeEnv === 'staging'
export const isProduction = nodeEnv === 'production'

// Validation function
export const validateConfig = (): boolean => {
  const requiredFields = [
    'VITE_API_URL',
    'VITE_NODE_ENV',
  ]

  const missing = requiredFields.filter(field => !import.meta.env[field])
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing)
    return false
  }

  return true
}

// Initialize validation
if (dev.enableDevTools) {
  validateConfig()
}

export default config