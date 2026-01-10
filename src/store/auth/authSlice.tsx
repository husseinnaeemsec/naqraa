import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser, InitialAuthStateProps } from '../../types/user';
import type { Enrollment } from '../../types/enrollments';

// Get initial state from localStorage if available
const initialState: InitialAuthStateProps = {
  user: null,
  isAuthenticated: false,
  // Setting this value to true allows Protected Routes to wait until the AuthProvider loades the user
  // And then set this back to false 
  loadingUser: true, // Start as true to prevent redirect flash on page refresh
  enrollments: [],
  notifications: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    setAuthenticationState: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
    },
    setUserEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
    },
    updateUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateUserPreferences: (state, action: PayloadAction<Partial<AuthUser['preferences']>>) => {
      if (state.user && state.user.preferences) {
        state.user = { ...state.user, preferences: { ...state.user.preferences, ...action.payload } };
      }
    },
    updateAccountInformation: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setLoadingState: (state, action: PayloadAction<boolean>) => {
      state.loadingUser = action.payload;
    },
    setEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.enrollments = [];
      state.notifications = [];
      localStorage.removeItem("user_cache");
      state.loadingUser = false;
      
      // When user logs out, restore language from localStorage if available
      // This allows unauthenticated users to maintain their language preference
      try {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && ['ar', 'en', 'ku'].includes(savedLanguage)) {
          // Note: The actual i18n language change will be handled by AuthProvider
          // since we can't access i18n instance from Redux slice
        }
      } catch (error) {
        console.warn('Error checking language in localStorage during logout:', error);
      }
    },

  },
});

export const { setAuthenticationState,setUserEnrollments,updateAccountInformation,updateUserPreferences,updateUserProfile,setUser,setEnrollments, updateUser, logoutUser, setLoadingState } = authSlice.actions;
export default authSlice.reducer;
