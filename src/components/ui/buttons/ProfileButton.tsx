"use Client";

import Image from "next/image";
import { useChain } from "@cosmos-kit/react";
// import { shortenAddress } from "@/utils/AddressShortner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState } from "react";
import { FaRegCopy, FaCheck } from "react-icons/fa";
import { ipfsLoader } from "@/utils/ipfsLoaders/ipfsLoader";


export default function ProfileButton() {
    const { openView } = useChain(`${process.env.NEXT_PUBLIC_CHAIN_NAME}`, true);

    // Retrieve the Wallet data from Redux store
    const Wallets = useSelector((state: RootState) => state.auth.Wallet);
    const User = useSelector((state: RootState) => state.auth.user);
    const [copied, setCopied] = useState(false);

    // Function to open the wallet connection modal
    const handleModelOpen = () => {
        openView();
    };

    const handleCopyAddress = async () => {
        if (Wallets?.address) {
            try {
                await navigator.clipboard.writeText(Wallets.address);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy!", err);
            }
        }
    };
    const imageSrc = User?.image?.startsWith("http")
        ? User.image
        : `https://${User?.image || "memesfun.mypinata.cloud/ipfs/bafkreicgshszjb37waaku4ll5azvlxrsk7wsodg6fkdn5yohquhbbvv4cu"}`;

    return (
        <>
            <div className="cont prof_box_header">
                {/* Button to open the wallet connection modal*/}
                <button>
                    {/* Display the wallet image or a default image if null */}
                    <Image
                        loader={ipfsLoader}
                        src={imageSrc}
                        alt="Wallet Icon"
                        width={48}
                        height={48}
                        className="img-fluid prof_img"
                        onClick={handleModelOpen}
                    />
                    <div className="prof_box_header_name d-flex align-items-center">
                        {/* Display the wallet name if available */}
                        <span className="">{User?.name}</span>
                        {/* Display the shortened address or default text */}
                        <p className="cursor-pointer mb-0 mx-2" onClick={handleCopyAddress}>
                            {/* {Wallets?.address ? shortenAddress(Wallets.address) : "Connect Wallet"} */}
                            {Wallets?.address && !copied ? (
                                <span
                                    className="cursor-pointer"
                                    onClick={handleCopyAddress}
                                >
                                    <> </><FaRegCopy className="prof_box_header_copy" />
                                </span>
                            ) : (
                                <span>
                                    <> </><FaCheck />
                                </span>
                            )}
                        </p>
                    </div>
                </button>
            </div>
        </>
    );
};
