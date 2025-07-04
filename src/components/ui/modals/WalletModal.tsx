'use client'
import { useState, useEffect } from 'react';
import { useChain } from "@cosmos-kit/react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "@/store/slice/authSlice"
import { RootState } from "@/store/store";
import { WalletModalProps } from "@cosmos-kit/core";
import { ChainWalletBase } from "@cosmos-kit/core";
import { usePopup } from "@/providers/PopupProvider";
import axios from "axios";
import Loader from "@/components/ui/common/Loader";
import Link from 'next/link';

declare global {
    interface Window {
        keplr?: Record<string, unknown>;
        leap?: Record<string, unknown>;
        cosmostation?: Record<string, unknown>;
    }
};

// Define the interface for wallet modal props
interface walletModalProps {
    name: string;
    address: string;
    image: string;
};

const isMobileDevice = (): boolean => {
    if (typeof window === "undefined") return false;
    return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
};


const getMobilePlatform = (): 'android' | 'ios' | null => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) return 'ios';
    if (/android/.test(ua)) return 'android';
    return null;
};

// WalletModal component to handle wallet connections
export const WalletModal = ({ isOpen, walletRepo }: WalletModalProps) => {
    // Retrieve necessary functions and states from hooks
    const { closeView, disconnect, address } = useChain(`${process.env.NEXT_PUBLIC_CHAIN_NAME}`, true);
    const { showPopup } = usePopup();
    const ApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [loading, setLoading] = useState(false);
    const token = useSelector((state: RootState) => state?.auth?.token || null);
    const dispatch = useDispatch();
    const isAuthenticated: boolean | null = useSelector((state: RootState) => state.auth.isAuthenticated);

    // Define available wallet extensions
    const extensions = {
        keplr: window.keplr,
        leap: window.leap,
        cosmostation: window.cosmostation
    };



    // Function to close the wallet modal
    const handleModelClose = () => {
        closeView();
    };

    // Function to handle login by dispatching loginSuccess action
    const handle_login = async (Wallet: walletModalProps): Promise<void> => {
        setLoading(true);
        try {
            const response = await axios.post(`${ApiUrl}/auth/login-register`,
                {
                    address: Wallet.address
                }
            )
            if (response.status === 200 || response.status === 201) {
                const data = response.data.data;
                showPopup('Wallet connected successfully.', 'success');
                dispatch(
                    loginSuccess({
                        user: {
                            name: data.name,
                            image: data.image
                        },
                        token: data.token,
                        wallet: {
                            address: Wallet.address,
                            name: Wallet.name,
                            image: Wallet.image,
                        }
                    })
                );
            }
        } catch (error) {
            showPopup('Login/Register Failed.', 'error');
            console.error("Login/Register Failed:", error);
            await handle_disconnect();
        } finally {
            setLoading(false);
        }

    };

    // Function to handle logout by dispatching logout action
    const handle_logout = async (): Promise<void> => {
        dispatch(logout());
    };

    // Function to disconnect the wallet and log out
    const handle_disconnect = async (): Promise<void> => {
        await disconnect();
        await handle_logout();
        showPopup('Wallet disconnected successfully.', 'error');
    };

    // Function to handle wallet connection
    const handleConnect = async (wallet: ChainWalletBase) => {
        try {
            if (!wallet) {
                showPopup("No wallet instance provided.", "error");
                return;
            }

            const walletInfo = wallet.walletInfo;
            if (!walletInfo) {
                showPopup("Invalid wallet information.", "error");
                return;
            }

            const { downloads, prettyName, logo } = walletInfo;
            const normalizedPrettyName = prettyName?.toLocaleLowerCase().normalize("NFD") || "";

            // Find a matching extension for the wallet
            const matchingExtension = Object.keys(extensions).find(
                ext => ext.toLocaleLowerCase().normalize("NFD") === normalizedPrettyName
            ) as keyof typeof extensions;

            if (!matchingExtension) {
                showPopup(`No Extension found for ${prettyName}.`, "error");
                return;
            }

            // Check if the extension is installed, if not, provide a download link
            if (!extensions[matchingExtension]) {
                if (isMobileDevice()) {
                    if (matchingExtension === "keplr") {
                        const keplrLink = `keplrwallet://walletconnect?chain_id=${process.env.NEXT_PUBLIC_CHAIN_NAME}`;
                        const fallback =
                            getMobilePlatform() === "ios"
                                ? "https://apps.apple.com/app/keplr-wallet/id1567851089"
                                : "https://play.google.com/store/apps/details?id=com.chainapsis.keplr";

                        let didRedirect = false;

                        // Open the deep link directly
                        window.location.href = keplrLink;

                        const timeout = setTimeout(() => {
                            if (!didRedirect) {
                                window.location.href = fallback;
                            }
                        }, 2000);

                        const handleVisibilityChange = () => {
                            if (document.hidden) {
                                didRedirect = true;
                                clearTimeout(timeout);
                                document.removeEventListener("visibilitychange", handleVisibilityChange);
                            }
                        };

                        document.addEventListener("visibilitychange", handleVisibilityChange);
                        return;
                    }

                    if (matchingExtension === "leap" || matchingExtension === "cosmostation") {
                        showPopup(`${prettyName} mobile connection is currently not supported. Please use a desktop browser.`, "error");
                        return;
                    }

                    showPopup(`Mobile deep link not available for ${prettyName}`, "error");
                    return;
                }
                const downloadLink = downloads?.[0]?.link;

                if (downloadLink) {
                    closeView();
                    window.open(downloadLink, "_blank");
                    showPopup(`Redirecting to download ${prettyName} extension...`, "error");
                    return;
                }

                showPopup(`No download link found for ${prettyName}.`, "error");
                return;
            }

            // Connect to the wallet
            await wallet.connect();

            if (!wallet.address) {
                showPopup("Failed to retrieve wallet address.", "error");
                await handle_logout();
                return;
            }


            // Store the connected wallet details
            const walletData: walletModalProps = {
                address: wallet.address,
                name: prettyName,
                image: typeof logo === "string" ? logo : "/assets/img/wallet.svg",
            };

            await handle_login(walletData);
            closeView();
            return;
        } catch (error) {
            console.error("Wallet connection failed:", error);
            showPopup("Wallet connection failed. Please try again.", "error");
        }
    };
    useEffect(() => {
        if (!token) {
            dispatch(logout());
        }
    }, [token, dispatch, showPopup]);

    // If the modal is not open, return <></>
    if (!isOpen) return <></>;

    return (
        <div
            className="position-fixed connect_wallet top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
            style={{ zIndex: 9999 }}

        >
            <div className="modal-dialog modal-dialog-centered" style=
                {{
                    //  background: "url('/assets/img/connect_modal.png')"
                }}
            >
            {/* <DropAnimation/> */}

                <div className="modal-content">
                    {loading && <Loader />}
                    {/* Modal Header */}
                    <div className="modal-header">
                        {address && isAuthenticated ? (
                            <h5 className="modal-title">Wallet Connected</h5>
                        ):(
                            <h5 className="modal-title">Select Wallet</h5>
                        )}

                        <button type="button" className="btn-close" aria-label="Close" onClick={handleModelClose}></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body">

                        {/* Display options based on authentication status */}
                        {address && isAuthenticated ? (
                            <>
                                <p>You have Picked your wallet and connected to start and leveling up your token game on memes.fun!</p>
                                {isMobileDevice() && (
                                    <div className="alert alert-info">
                                        You&apos;re on a mobile device. Tap your wallet to open its app and connect.
                                    </div>
                                )}
                               <Link className='btn_wallet' onClick={handleModelClose} href={`/profile/${address}`}>View Profile</Link>

                                <button className="btn_wallet" onClick={handle_disconnect}>
                                    disconnect
                                </button>
                            </>
                        ) : (
                            <>
                                <p>Pick your wallet, connect, and start leveling up your token game on memes.fun!</p>
                                {isMobileDevice() && (
                                    <div className="alert alert-info">
                                        You&apos;re on a mobile device. Tap your wallet to open its app and connect.
                                    </div>
                                )}
                            <ul>
                                {/* Render available wallets */}
                                {walletRepo?.wallets?.map((wallet: ChainWalletBase, index: number) => (
                                    <li key={index}>
                                        <button className="btn_wallet" onClick={() => handleConnect(wallet)}>
                                            <Image
                                                alt={wallet.walletInfo.prettyName}
                                                src={typeof wallet.walletInfo.logo === "string" ? wallet.walletInfo.logo : "/assets/img/wallet.svg"}
                                                width={58}
                                                height={58}
                                            />
                                            {wallet.walletInfo.prettyName + " Wallet"}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
