"use client";

import { ChainProvider } from "@cosmos-kit/react";
import { chains, assets } from "chain-registry";
import { wallets as leapWallets } from "@cosmos-kit/leap-extension";
import { wallets as keplrWallets } from "@cosmos-kit/keplr-extension";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation-extension";
import { WalletModal } from "@/components/ui/modals/WalletModal";

export function CosmosProvider({ children }: { children: React.ReactNode }) {
    return (
        <ChainProvider
            // Register both default chains and the custom Zigchain
            chains={[...chains]}

            // Include default assets and Zigchain-specific assets
            assetLists={[...assets]}

            //TODO: Add wallets (if needed)
            // Support multiple wallet extensions for users
            wallets={[...leapWallets, ...keplrWallets, ...cosmostationWallets]}

            // Use a custom wallet modal for improved UI experience
            walletModal={WalletModal}
            throwErrors={false}
        >
            {children}
        </ChainProvider>
    );
};
