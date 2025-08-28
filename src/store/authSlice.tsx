import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {InitialAuthState, User} from '../../types';

// Get initial state from localStorage if available

const initialState : InitialAuthState = {
  user: null,
  isAuthenticated: false,
  // Setting this value to true allows Protected Routes to wait until the AuthProvider loades the user
  // And then set this back to false 
  loadingUser: true,
  authError: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticationState:(state,action:PayloadAction<boolean>)=>{
      state.isAuthenticated = action.payload;
    },
    setUser:(state,action:PayloadAction<User|null>)=>{
      state.user = action.payload;
    },
    setLoadingState:( state , action:PayloadAction<boolean> )=>{
      state.loadingUser = action.payload;
    }
  },
});

export const { setAuthenticationState,setUser , setLoadingState } = authSlice.actions;
export default authSlice.reducer;
