"use Client";

import {useState} from "react";
import WalletModal from "@/components/ui/modals/WalletModal";
import Image from "next/image";


export default function WalletConnect() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="cont">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Image
                        src="/assets/img/wallet.png"
                        alt="Wallet Icon"
                        width={48}
                        height={48}
                        className="img-fluid"
                    />
                    <span>Connect Wallet</span>
                </button>
            </div>
            <WalletModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
};
