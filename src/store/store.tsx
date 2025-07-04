'use client'

import { configureStore } from "@reduxjs/toolkit";
import authReducer from '@/store/slice/authSlice';

const store = configureStore({
    reducer: {
        auth: authReducer, // Manages authentication-related state
    }
});

// TypeScript types for better type safety in the application
export type RootState = ReturnType<typeof store.getState>; // Represents the global state type
export type AppDispatch = typeof store.dispatch; // Represents the dispatch function type

export default store; // Export the store for use in the application