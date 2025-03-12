"use client";
import { useTheme } from "@/app/ThemeContext"

export default function DarkModeButton(){
    const {theme, toggleTheme} = useTheme();
    return(
        <div className=" style3">
            <div className="">
                <label className="switch" htmlFor="checkbox">
                    <input
                        type="checkbox"
                        id="checkbox"
                        checked={theme === "dark"}
                        onChange={toggleTheme}
                    />
                    <div className="slider round"></div>
                </label>
            </div>
        </div>
    )
};