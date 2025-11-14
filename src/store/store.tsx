import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import uiReducer from './uiSlice';
import enrollmentReducer from './enrollmentSlice';
import chatReducer from './chatSlice';
import ApiReduceer from './apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui:uiReducer,
    enrollment:enrollmentReducer,
    chat:chatReducer,
    api:ApiReduceer,
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
