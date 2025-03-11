"use client";

import {createContext, useContext, useEffect, useState} from "react";

interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
}

interface ThemeProviderProps {
    children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextType>(
    {
        theme:'dark',
        toggleTheme:() => {},
    }
);

export function ThemeProvider({ children }:ThemeProviderProps) {
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
            document.body.classList.add(storedTheme);
            document.body.setAttribute("data-bs-theme", storedTheme);
        }
    }, []);
    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);

        document.body.classList.remove(theme);
        document.body.classList.add(newTheme);
        document.body.setAttribute("data-bs-theme", newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}