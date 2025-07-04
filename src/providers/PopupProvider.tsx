"use client";

import { createContext, useState, useContext, useEffect, useRef } from "react";
import type { Toast as BootstrapToastType } from "bootstrap";

// Function to dynamically import Bootstrap's Toast component (only runs in the browser)
const loadBootstrapToast = async (): Promise<typeof BootstrapToastType | null> => {
    if (typeof window !== "undefined") {
        const bootstrap = await import("bootstrap");
        return bootstrap.Toast;
    }
    return null;
};

// Define the context type for the popup
interface PopupContextType {
    showPopup: (message: string, type?: "success" | "error" | "warning") => void;
}

// Define the props type for the provider component
interface ToastContextType {
    children: React.ReactNode;
}

// Create a Context for managing popups
const PopupContext = createContext<PopupContextType | undefined>(undefined);

// Custom hook to use the popup context
export const usePopup = (): PopupContextType => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error("usePopup must be used within a PopupProvider");
    }
    return context;
};

// Popup Provider Component
export const PopupProvider = ({ children }: ToastContextType) => {
    const [popupMessage, setPopupMessage] = useState<string | null>(null); // Stores the message to display
    const [popupType, setPopupType] = useState<"success" | "error" | "warning">("success"); // Stores the type of popup
    const toastRef = useRef<HTMLDivElement>(null); // Ref for the toast container
    const toastInstanceRef = useRef<BootstrapToastType | null>(null); // Stores the Bootstrap toast instance
    const bootstrapToastRef = useRef<typeof BootstrapToastType | null>(null); // Stores the Bootstrap Toast class reference

    // Load Bootstrap Toast class on component mount
    useEffect(() => {
        const fetchToast = async () => {
            const ToastClass = await loadBootstrapToast();
            if (ToastClass) {
                bootstrapToastRef.current = ToastClass; // Store the class reference
            }
        };
        fetchToast();
    }, []);

    // Function to show the popup with a given message and type
    const showPopup = (message: string, type: "success" | "error" | "warning" = "success") => {
        if (toastInstanceRef.current) {
            toastInstanceRef.current.hide(); // Hide any existing toast before showing a new one
        }
        setPopupMessage(null);

        // Delay to ensure the state updates properly
        setTimeout(() => {
            setPopupType(type);
            setPopupMessage(message);
        }, 100);
    };

    // Function to close the popup manually
    const closePopup = () => {
        if (toastInstanceRef.current) {
            toastInstanceRef.current.hide();
        }
        setPopupMessage(null);
    };

    // Initialize and show the toast when `popupMessage` changes
    useEffect(() => {
        const initToast = async () => {
            if (typeof window !== "undefined" && popupMessage && toastRef.current && bootstrapToastRef.current) {
                // Create a new Bootstrap Toast instance if it doesn't exist
                if (!toastInstanceRef.current) {
                    toastInstanceRef.current = new bootstrapToastRef.current(toastRef.current, { autohide: false });
                }
                toastInstanceRef.current.show();

                // Auto-hide toast after 1.8 seconds
                setTimeout(() => {
                    closePopup();
                }, 5000);
            }
        };

        initToast();
    }, [popupMessage]);

    return (
        <PopupContext.Provider value={{ showPopup }}>
            {children}

            {/* Toast Popup */}
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 999999999 }}>
                <div
                    ref={toastRef}
                    className={`toast align-items-center text-white bg-${popupType === "error" ? "danger" : popupType === "warning" ? "warning" : "success"} border-0`}
                    role="alert"
                >
                    <div className="d-flex">
                        <div className="toast-body">{popupMessage}</div>
                        <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={closePopup}></button>
                    </div>
                </div>
            </div>
        </PopupContext.Provider>
    );
};
