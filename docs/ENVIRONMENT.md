# Environment Variables Setup Guide

This document explains how to configure environment variables for the Naqraa frontend application.

## Environment Files

The project supports multiple environment configurations:

- `.env` - Development environment (committed to repo)
- `.env.staging` - Staging environment (committed to repo)
- `.env.production` - Production environment (committed to repo)
- `.env.example` - Template file showing all available variables
- `.env.local` - Local overrides (not committed, ignored by git)
- `.env.[mode].local` - Environment-specific local overrides (not committed)

## Environment Variables

### Core Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_NODE_ENV` | Environment mode | `development` | ✅ |
| `VITE_APP_NAME` | Application name | `Naqraa` | ✅ |
| `VITE_APP_VERSION` | Application version | `1.0.0` | ✅ |
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api` | ✅ |

### Feature Flags

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_ENABLE_CHAT` | Enable chat functionality | `true` |
| `VITE_ENABLE_NOTIFICATIONS` | Enable notifications | `true` |
| `VITE_ENABLE_DARK_MODE` | Enable dark mode toggle | `true` |
| `VITE_ENABLE_PWA` | Enable PWA features | `false` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics tracking | `false` |

### External Services

| Variable | Description | Required for Production |
|----------|-------------|------------------------|
| `VITE_GOOGLE_ANALYTICS_ID` | Google Analytics tracking ID | ❌ |
| `VITE_SENTRY_DSN` | Sentry error tracking DSN | ❌ |
| `VITE_INTERCOM_APP_ID` | Intercom customer support | ❌ |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | ❌ |
| `VITE_FACEBOOK_APP_ID` | Facebook OAuth app ID | ❌ |

## Setup Instructions

### 1. Development Setup

```bash
# Copy the example file
cp .env.example .env

# Edit the file with your development settings
nano .env

# Start development server
npm run dev
```

### 2. Staging Setup

```bash
# Use the staging environment
npm run dev:staging

# Build for staging
npm run build:staging
```

### 3. Production Setup

```bash
# Update .env.production with your production values
nano .env.production

# Build for production
npm run build:production
```

### 4. Local Overrides

Create `.env.local` for local development overrides:

```bash
# Create local override file
touch .env.local

# Add your local overrides (this file is gitignored)
echo "VITE_API_URL=http://your-local-api:8000/api" >> .env.local
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:staging` | Start with staging environment |
| `npm run build` | Build for production |
| `npm run build:staging` | Build for staging |
| `npm run build:production` | Build for production (explicit) |
| `npm run preview` | Preview production build |
| `npm run env:validate` | Validate environment configuration |

## Environment Validation

The application includes built-in environment validation:

```bash
# Check if all required environment variables are set
npm run env:validate
```

## Type Safety

Environment variables are type-safe through:

- `src/env.d.ts` - TypeScript interface definitions
- `src/config/env.ts` - Runtime configuration and validation

## Usage in Code

```typescript
import { config } from '@/config/env'

// Use configuration object
const apiUrl = config.apiUrl
const features = config.features.chat

// Or import specific sections
import { apiUrl, features } from '@/config/env'

// Environment checks
import { isDevelopment, isProduction } from '@/config/env'
```

## Security Notes

1. **Never commit sensitive values** like API keys to git
2. Use `.env.local` files for sensitive local development values
3. Production secrets should be set via deployment platform environment variables
4. The `.env.production` file should contain placeholder values, not real secrets

## Deployment

### Vercel
```bash
# Set environment variables in Vercel dashboard
vercel env add VITE_API_URL production
```

### Netlify
```bash
# Set in netlify.toml or dashboard
[build.environment]
  VITE_API_URL = "https://api.naqraa.com/api"
```

### Docker
```dockerfile
# Pass environment variables to container
ENV VITE_API_URL=https://api.naqraa.com/api
ENV VITE_NODE_ENV=production
```

## Troubleshooting

### Common Issues

1. **Variables not loaded**: Ensure they start with `VITE_`
2. **Build fails**: Check required variables are set
3. **Wrong environment**: Verify `--mode` flag in scripts

### Debug Environment

```typescript
// Add to your component for debugging
console.log('Environment:', import.meta.env)
console.log('Config:', config)
```

## Contributing

When adding new environment variables:

1. Add to all environment files (`.env*`)
2. Update TypeScript interface in `src/env.d.ts`
3. Add to configuration in `src/config/env.ts`
4. Update this documentation
5. Add validation if required