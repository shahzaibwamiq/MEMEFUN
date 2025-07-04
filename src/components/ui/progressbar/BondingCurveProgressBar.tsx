// components/ui/CircularProgress.tsx
import React from "react";

interface CircularProgressProps {
    progress: number; // 0 to 100
    size?: number;
    strokeWidth?: number;
    color?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
                                                               progress,
                                                               size = 115,
                                                               strokeWidth = 15,
                                                               color = "#4dd5ff",
                                                           }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress / 100);

    return (
        <svg width={size} height={size} className="rotate-[90deg] prof_prog">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="#707070"
                strokeWidth={50}
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
            />
        </svg>
    );
};

export default CircularProgress;
