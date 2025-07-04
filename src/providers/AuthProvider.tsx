"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { paths } from "@/paths";
import { usePopup } from "@/providers/PopupProvider";
import { useChain } from "@cosmos-kit/react";

// Define private routes that require authentication
const privateRoutes: string[] = [
    // paths.profile,
    paths.tokens,
];

// Define authentication provider type
interface AuthProviderProps {
    children: React.ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
    // Get the auth token from Redux store
    const authToken: string | null = useSelector((state: RootState) => state.auth.token);

    // Get the current route pathname
    const pathname: string = usePathname();

    // Next.js router instance for navigation
    const router = useRouter();

    // Access the showPopup function from the PopupProvider
    const { showPopup } = usePopup();

    // State to track authentication check status
    const [checkingAuth, setCheckingAuth] = useState(true);

    // State to prevent multiple warning popups from showing rapidly
    const [showingWarning, setShowingWarning] = useState(false);

    // Check if the current page is a private route
    const isPrivatePage: boolean = privateRoutes.includes(pathname);
    const { address, openView } = useChain(`${process.env.NEXT_PUBLIC_CHAIN_NAME}`, true);

    useEffect(() => {
        const verifyAuth = async () => {
            // Simulating an async auth check (e.g., could be API validation in the future)
            await new Promise((resolve) => setTimeout(resolve, 100));

            setCheckingAuth(false);

            // If user is not authenticated and trying to access a private page, redirect to home
            if (!authToken && isPrivatePage && !showingWarning) {
                setShowingWarning(true);

                // Show an error popup to notify the user
                showPopup('Wallet connectivity required.', 'error');

                // Redirect the user to the home page
                router.replace(paths.home);

                // Prevent repeated warnings for a short time
                setTimeout(() => setShowingWarning(false), 500);
            }
        };

        verifyAuth();
    }, [authToken, pathname, checkingAuth, router, isPrivatePage, showPopup, showingWarning]);

    // Effect to handle opening wallet view when no address is available
    useEffect(() => {
        if (!authToken && isPrivatePage && !address) {
            openView();
        }
    }, [authToken, isPrivatePage, address, openView]);

    // If authentication check is in progress, don't render anything
    if (checkingAuth) return null;

    // If the user is not authenticated and trying to access a private page, prevent rendering children
    if (!authToken && isPrivatePage) return null;

    // Render children if authentication is valid or the page is public
    return <>{children}</>;
};
