'use client'

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setCookie, getCookie, deleteCookie } from "@/utils/cookies/AuthCookies";

const storedWallet = typeof window !== "undefined" ? localStorage.getItem("AuthWallet") : null;

interface User {
    name: string;
    image?: string;
}

// Define wallet payload type
interface WalletPayload {
    address: string;
    name: string;
    image?: string; // Optional wallet image
}

// Define authentication state type
interface AuthState {
    user: User | null; // Stores user data
    loading: boolean; // Indicates if authentication is in progress
    isAuthenticated: boolean; // Tracks whether the user is authenticated
    token: string | null; // Stores authentication token
    Wallet: WalletPayload | null; // Stores wallet details
}

const isClient = typeof window !== "undefined";

// Define initial authentication state
const initialState: AuthState = {
    user: isClient ? getCookie("AuthUser") : null,
    loading: false,
    isAuthenticated: !!(isClient && getCookie("AuthToken")),
    token: isClient ? getCookie("AuthToken") : null,
    Wallet: storedWallet ? JSON.parse(storedWallet) : null
};

// Create auth slice using Redux Toolkit
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Handles the start of the login process (e.g., setting loading state)
        loginStart: (state) => {
            state.loading = true;
        },
        // Handles successful login, updating user state and storing data in localStorage
        loginSuccess: (state, action: PayloadAction<{ user: User; token: string; wallet: WalletPayload }>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
            state.Wallet = action.payload.wallet;

            // Store authentication data in localStorage (only in client-side)
            if (typeof window !== "undefined") {
                localStorage.setItem("AuthWallet", JSON.stringify(action.payload.wallet));
                setCookie("AuthToken", state.token);
                setCookie("AuthUser", state.user);
            }
        },
        // Handles login failure by stopping the loading state
        loginFailure: (state) => {
            state.loading = false;
        },
        // Handles logout by clearing authentication data
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
            state.Wallet = null;

            // Remove authentication data from localStorage
            if (typeof window !== "undefined") {
                deleteCookie("AuthToken");
                deleteCookie("AuthUser");
                localStorage.removeItem("AuthWallet");
            }
        }
    }
});

// Export action creators for dispatching actions
export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// Export reducer to be used in the store
export default authSlice.reducer;
