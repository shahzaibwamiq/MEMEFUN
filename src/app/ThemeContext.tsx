"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Define the structure of the theme context
interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
}

interface ThemeProviderProps {
    children: React.ReactNode;
}

// Create the ThemeContext with a default value
const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',  // Default theme
    toggleTheme: () => { }, // Placeholder function
});

// ThemeProvider component manages the theme state and provides it to the context
export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        if (typeof window !== "undefined") {
            // Dynamically import Bootstrap JS bundle for UI functionality
            import("bootstrap/dist/js/bootstrap.bundle.min.js")
                .then(() => {})
                .catch((err) => console.error("Bootstrap JS Error:", err));

            // Retrieve the stored theme from localStorage and apply it    
            const storedTheme = localStorage.getItem("theme");
            if (storedTheme) {
                setTheme(storedTheme);
                document.body.classList.add(storedTheme);
                document.body.setAttribute("data-bs-theme", storedTheme);
            }
        }
    }, []);

    // Function to toggle between "dark" and "light" themes
    const toggleTheme = () => {
        if (typeof window !== "undefined") {
            const newTheme = theme === "dark" ? "light" : "dark";
            setTheme(newTheme);
            localStorage.setItem("theme", newTheme);

            // Update the body's class and Bootstrap theme attribute
            document.body.classList.remove(theme);
            document.body.classList.add(newTheme);
            document.body.setAttribute("data-bs-theme", newTheme);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to access theme context
export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);

    // Ensure the hook is used inside a ThemeProvider
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
