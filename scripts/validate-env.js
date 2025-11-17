#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * Validates that all required environment variables are properly set
 */

import { config, validateConfig } from '../src/config/env.js'

console.log('🔍 Validating Naqraa Frontend Environment Configuration...\n')

// Display current environment
console.log(`📊 Current Environment: ${config.nodeEnv}`)
console.log(`🏷️  App Name: ${config.appName}`)
console.log(`📦 App Version: ${config.appVersion}`)
console.log(`🌐 API URL: ${config.apiUrl}`)
console.log()

// Validate configuration
const isValid = validateConfig()

if (isValid) {
  console.log('✅ Environment configuration is valid!')
  
  // Display feature flags
  console.log('\n🚩 Feature Flags:')
  Object.entries(config.features).forEach(([key, value]) => {
    console.log(`   ${value ? '✅' : '❌'} ${key}: ${value}`)
  })
  
  // Display external services
  console.log('\n🔗 External Services:')
  Object.entries(config.external).forEach(([key, value]) => {
    if (value) {
      console.log(`   ✅ ${key}: ${value.substring(0, 20)}...`)
    } else {
      console.log(`   ❌ ${key}: Not configured`)
    }
  })
  
  process.exit(0)
} else {
  console.log('❌ Environment configuration has issues!')
  console.log('Please check the missing variables and update your .env file')
  process.exit(1)
}