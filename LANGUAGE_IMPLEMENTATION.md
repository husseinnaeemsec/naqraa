# Language Persistence Implementation

## Overview
This implementation adds intelligent language persistence that differentiates between authenticated and unauthenticated users, ensuring language preferences are properly stored and activated.

## Features Implemented

### 1. **Initial Language Loading (`src/i18n.ts`)**
- ✅ **Load from localStorage on app startup**: The app now checks localStorage for a saved language preference
- ✅ **Fallback to default**: If no saved language or invalid language found, defaults to Arabic ('ar')
- ✅ **Set document attributes**: Automatically sets `document.documentElement.dir` and `document.documentElement.lang` on initialization
- ✅ **Supported languages**: Arabic (ar), English (en), Kurdish (ku)

### 2. **Smart Language Switching (`src/components/LanguageSwitcher.tsx`)**
- ✅ **Authentication-aware saving**: Only saves to localStorage when user is **not authenticated**
- ✅ **Redux integration**: Uses `useAppSelector` to check authentication state
- ✅ **Error handling**: Includes try-catch blocks for localStorage operations
- ✅ **Document attributes**: Updates direction and language attributes when switching

### 3. **Authentication Integration (`src/AuthProvider.tsx`)**
- ✅ **Authenticated user language**: Loads language from user profile (`user.profile.lang`) for authenticated users
- ✅ **Clean localStorage**: Removes language from localStorage for authenticated users (server-side management)
- ✅ **Logout handling**: Restores language from localStorage when user logs out
- ✅ **Language attributes**: Sets document direction and language for authenticated users

### 4. **Logout Cleanup (`src/store/authSlice.tsx`)**
- ✅ **localStorage check**: Includes logic to prepare for language restoration on logout
- ✅ **State management**: Properly handles authentication state changes

## How It Works

### For Unauthenticated Users:
1. **App loads** → Check localStorage for saved language → Apply language + set document attributes
2. **User changes language** → Update i18n + document attributes + save to localStorage
3. **Language persists** across browser sessions

### For Authenticated Users:
1. **User logs in** → Load language from user profile → Clear localStorage (server-side preference takes precedence)
2. **User changes language** → Update i18n + document attributes (no localStorage save)
3. **User logs out** → Restore language from localStorage if available

## Benefits

1. **🔄 Seamless Experience**: Language preference persists across sessions for unauthenticated users
2. **🔐 Profile Integration**: Authenticated users get their language from server-side profile
3. **🧹 Clean Separation**: Clear distinction between client-side (localStorage) and server-side (profile) preferences
4. **🛡️ Error Resistant**: Proper error handling for localStorage operations
5. **📱 Attribute Management**: Proper RTL/LTR direction and language attributes for accessibility

## Usage

The implementation is fully automatic. Users can:

1. **Select language from LanguageSwitcher** - it will be saved appropriately based on authentication status
2. **Have language restored on app reload** - from localStorage (unauthenticated) or profile (authenticated)
3. **Switch between authenticated/unauthenticated** - language handling adapts automatically

## Technical Details

### Language Configuration:
```typescript
const langConfig = {
  'ar': { dir: 'rtl' },  // Arabic - Right to Left
  'en': { dir: 'ltr' },  // English - Left to Right  
  'ku': { dir: 'rtl' }   // Kurdish - Right to Left
};
```

### Authentication Check:
```typescript
const { isAuthenticated } = useAppSelector((state) => state.auth);
```

### Conditional Storage:
```typescript
if (!isAuthenticated) {
  localStorage.setItem('language', langCode);
}
```

## Files Modified

1. **`src/i18n.ts`** - Initial language loading and document attribute setup
2. **`src/components/LanguageSwitcher.tsx`** - Authentication-aware language switching
3. **`src/AuthProvider.tsx`** - Profile-based language loading for authenticated users
4. **`src/store/authSlice.tsx`** - Logout language cleanup preparation

## Testing

The development server is running on `http://localhost:5174/`. You can test:

1. **Unauthenticated**: Change language → refresh page → language should persist
2. **Authenticated**: Login → language should load from profile → logout → localStorage language should restore
3. **RTL/LTR**: Check that document direction changes properly for Arabic/Kurdish vs English