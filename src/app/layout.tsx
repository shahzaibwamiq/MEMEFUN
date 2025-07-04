import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/partials/header";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { Poppins } from 'next/font/google';
import { ThemeProvider } from "@/app/ThemeContext";
import "bootstrap/dist/css/bootstrap.min.css"
import ReduxProvider from "@/providers/ReduxProvider";
import AuthProvider from "@/providers/AuthProvider";
import { PopupProvider } from "@/providers/PopupProvider";
import { CosmosProvider } from "@/lib/CosmosProvider";
import {CookieAutoLogout} from "@/services/AuthServices/AutoLogoutService";
// app/layout.tsx or app/globals.css
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Footer from "@/components/partials/footer";
import DropAnimation from "@/components/partials/DropAnimation";
import SocketProvider from "@/providers/SocketProvider";


// Configure FontAwesome to avoid auto-adding CSS since styles are manually imported
config.autoAddCss = false;

// Metadata for the application
export const metadata: Metadata = {
    title: "Meme Fun", // Website title
    description: "Memes Coins Luncher", // Website description
};

// Define Google Font (Poppins) with different weights and swap display mode
const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    display: "swap"
});
// Root layout component wrapping the entire application
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <body className={`${poppins.className} dark`} data-bs-theme="dark">
              
                {/* Wrap the application with necessary providers for state management, authentication, and themes */}
                <ReduxProvider>
                    <PopupProvider>
                        <CosmosProvider>
                                <AuthProvider>
                                    <ThemeProvider>
                                        <SocketProvider>
                                            <Header />
                                            <DropAnimation/>
                                            <CookieAutoLogout />
                                            {children}
                                            <Footer />
                                        </SocketProvider>
                                    </ThemeProvider>
                                </AuthProvider>
                        </CosmosProvider>
                    </PopupProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
