import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserType, InitialAuthStateProps } from '../../types/user';

// Get initial state from localStorage if available
const initialState: InitialAuthStateProps = {
  user: null,
  isAuthenticated: false,
  // Setting this value to true allows Protected Routes to wait until the AuthProvider loades the user
  // And then set this back to false 
  loadingUser: true, // Start as true to prevent redirect flash on page refresh
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    setAuthenticationState: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload;
    },
    updateUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserType>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    updateAccountInformation: (state, action: PayloadAction<Partial<UserType>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setLoadingState: (state, action: PayloadAction<boolean>) => {
      state.loadingUser = action.payload;
    },

    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loadingUser = false;
    },

  },
});

export const { setAuthenticationState,updateAccountInformation,updateUserProfile,setUser, updateUser, logoutUser, setLoadingState } = authSlice.actions;
export default authSlice.reducer;
