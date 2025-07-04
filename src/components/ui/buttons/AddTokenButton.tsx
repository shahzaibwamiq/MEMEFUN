'use client';

import { useChain } from '@cosmos-kit/react';
import { toast } from 'react-toastify';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';

interface AddToWalletProps {
    tokenDenom: string;
    tokenSymbol: string;
    className?: string;
    label?: string;
}

interface TokenMetadata {
    base: string;
    symbol: string;
    name: string;
    denom_units: Array<{
        denom: string;
        exponent: number;
    }>;
}

export default function AddToWalletButton({
    tokenDenom,
    tokenSymbol,
}: AddToWalletProps) {
    const { wallet, isWalletConnected, chain, getOfflineSigner, openView, chainWallet } = useChain(`${process.env.NEXT_PUBLIC_CHAIN_NAME}`);
    const rpc = chain?.apis?.rpc?.[0]?.address || process.env.NEXT_PUBLIC_RPC_ADDRESS;

    if (!rpc) {
        console.error("RPC endpoint is not defined.");
        return;
    }

    const addToken = async () => {
        try {
            if (!wallet) {
                console.error("Wallet not initialized.");
                openView();
                return;
            }
            if (!isWalletConnected) {
                openView();
            }

            const offlineSigner = getOfflineSigner();
            const client = await SigningCosmWasmClient.connectWithSigner(
                rpc,
                offlineSigner!
            );

            let metadata: TokenMetadata;
            try {
                const res = await client.queryContractSmart(
                    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
                    {
                        token_by_base: {
                            base: tokenDenom,
                        },
                    }
                );
                metadata = res as TokenMetadata;

                if (!chainWallet?.client?.suggestToken) {
                    toast.error('This wallet does not support token addition.');
                    return;
                }

                const walletClient = chainWallet?.client;

                if (walletClient && typeof walletClient.suggestToken === 'function') {
                    // const coinDecimals = metadata?.denom_units?.find((d) => d.denom === tokenDenom)?.exponent ?? 6;

                    if (!metadata?.base || !metadata?.symbol) {
                        toast.error("Invalid token metadata");
                        console.error("Invalid token metadata");
                        return;
                    }

                    // await (walletClient?.suggestToken as any)({
                    //     chainName: chain.chain_name,
                    //     chainId: chain.chain_id,
                    //     type: 'cw20',
                    //     tokens: [
                    //         {
                    //             contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
                    //             symbol: metadata?.symbol,
                    //             base: metadata?.base,
                    //             coinDecimals,
                    //             name: metadata?.name,
                    //             imageUrl: 'https://memesfun.mypinata.cloud/ipfs/bafkreicgshszjb37waaku4ll5azvlxrsk7wsodg6fkdn5yohquhbbvv4cu',
                    //         },
                    //     ],
                    // });
                    toast.success(`${tokenSymbol} added to wallet.`);
                } else {
                    toast.error('This wallet does not support direct token addition.');
                    console.error('This wallet does not support direct token addition.');
                }
            } catch (err) {
                toast.error('Failed to add token to wallet.');
                console.warn('Token metadata fetch failed, using fallback.', err);
            }
        } catch (error) {
            toast.error('Failed to add token to wallet.');
            console.error('Error adding token:', error);
        }
    };

    return (
        <button onClick={addToken} className="add_btn">
            <i className="fa-solid fa-plus"></i>
        </button>
    );
}
