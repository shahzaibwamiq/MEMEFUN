import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/partials/header";
import BootstrapProvider from "@/components/partials/BootstrapProvider";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { Poppins } from 'next/font/google';
import { ThemeProvider } from "@/app/ThemeContext";


const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

// Metadata
export const metadata: Metadata = {
    title: "Meme Fun",
    description: "Zigchain Luncher",
};

export default function RootLayout({ children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body className={`${poppins.className} dark`} data-bs-theme="dark">
        <ThemeProvider>
            <BootstrapProvider />
            <Header />
           {children}
        </ThemeProvider>
        </body>
        </html>
    );
}
