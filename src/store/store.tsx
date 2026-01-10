import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import uiReducer from './uiSlice';
import chatReducer from './chatSlice';
import ApiReduceer from './apiSlice';
import enrollmentReducer from './enrollmentSlice';
import studentReducer from './student/studentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui:uiReducer,
    chat:chatReducer,
    api:ApiReduceer,
    enrollment: enrollmentReducer,
    student:studentReducer
  },
});

// ✅ Types for RootState & AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ Custom hooks (اختياري: يسهل الاستخدام مع التايبسكريبت)
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
