"use Client";

import {useState} from "react";
import WalletModal from "@/components/ui/modals/WalletModal";


export default function WalletConnect() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
        <div className="cont">
            <button
                onClick={() => setIsOpen(!isOpen)}
            >
                <img src="./assets/img/wallet.png" alt="" />
                <span>Connect Wallet</span>
            </button>
        </div>
            <WalletModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
};