import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Enrollment, InitialAuthState, Notification, StudyTimeWeek, User } from '../../types';

// Get initial state from localStorage if available
const initialState: InitialAuthState = {
  user: null,
  isAuthenticated: false,
  // Setting this value to true allows Protected Routes to wait until the AuthProvider loades the user
  // And then set this back to false 
  loadingUser: true,
  authError: [],
  enrollments: [],
  ready_for_notifications: false,
  notifications: [],
  week_study_time: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setNotificationsState: (state, action: PayloadAction<boolean>) => {
      state.ready_for_notifications = action.payload;
    },
    setWeekStudyTime: (state, action: PayloadAction<StudyTimeWeek | null>) => {
      state.week_study_time = action.payload;

    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
    setAuthenticationState: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.week_study_time = action.payload?.week_study_time || null 

    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.week_study_time = action.payload?.week_study_time || null;
    },
    setLoadingState: (state, action: PayloadAction<boolean>) => {
      state.loadingUser = action.payload;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.enrollments = [];
      state.notifications = [];
      localStorage.removeItem("user_cache");
      state.loadingUser = false;
    },

    setUserEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
    },
    appendEnrollment: (state, action: PayloadAction<Enrollment>) => {
      state.enrollments = [...state.enrollments, action.payload]
    }
  },
});

export const { setAuthenticationState, setWeekStudyTime, setNotifications, setNotificationsState, setUserEnrollments, appendEnrollment, setUser, updateUser, logoutUser, setLoadingState } = authSlice.actions;
export default authSlice.reducer;
