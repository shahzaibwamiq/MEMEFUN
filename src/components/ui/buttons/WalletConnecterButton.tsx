"use Client";

import Image from "next/image";
import { useChain } from "@cosmos-kit/react";

export default function WalletConnect() {
    // Initialize the useChain hook with "zigchain"
    const { openView } = useChain(`${process.env.NEXT_PUBLIC_CHAIN_NAME}`, true);

    // Function to handle wallet connection modal opening
    const handleModelOpen = () => {
        openView();
    };

    return (
        <>
            <div className="cont ">
                {/* Button to trigger wallet connection */}
                <button onClick={handleModelOpen}>
                    {/* Wallet Icon */}
                    <Image
                        src="/assets/img/wallet.svg"
                        alt="Wallet Icon"
                        width={33}
                        height={25}
                        className="img-fluid wallet_img"
                    />
                    {/* Button Label */}
                    <span>Connect Wallet</span>
                </button>
            </div>
        </>
    );
};
