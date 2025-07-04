"use client";
import { useTheme } from "@/app/ThemeContext"

export default function DarkModeButton() {
    const { toggleTheme } = useTheme(); // Access theme state and toggle function from context

    return (
        <div className=" style3">
            <div className="">
                {/* Toggle switch for dark mode */}
                <label className="switch" htmlFor="checkbox">
                    <input
                        type="checkbox"
                        id="checkbox"
                        // value={theme === "dark"}
                        onChange={toggleTheme}
                    />
                    <div className="slider round"></div> {/* Custom slider UI */}
                </label>
            </div>
        </div>
    );
};