"use client";

import { Provider } from "react-redux";
import store from "@/store/store";

// This component wraps the entire application with Redux's Provider
// It ensures that all child components have access to the Redux store
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}
