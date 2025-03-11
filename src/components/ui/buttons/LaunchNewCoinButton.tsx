"use client";

import LaunchTokenModal from "@/components/ui/modals/LaunchTokenModal";
import {useState} from "react";

interface ButtonProps {
    ButtonText?: string;
}

export default function LaunchNewCoinButton({ButtonText}: ButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="banner_btn">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {ButtonText ?? "Launch New Coin"}
                </button>
            </div>

            <LaunchTokenModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}