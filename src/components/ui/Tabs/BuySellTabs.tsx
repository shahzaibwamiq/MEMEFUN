"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Slippage from "../modals/Slippage";
import { BuyTokenTx, BuyTokenMsg } from "@/utils/ZigChain/SellPurchaseToken/BuyToken";
import { SellTokenTx } from "@/utils/ZigChain/SellPurchaseToken/SellToken";
import { useChain } from "@cosmos-kit/react";
import { usePopup } from "@/providers/PopupProvider";
import { CoinAttributes } from "@/utils/Interfaces/CoinInterfaces";
import { ipfsLoader } from "@/utils/ipfsLoaders/ipfsLoader";
import axios from "axios";
import { StargateClient } from "@cosmjs/stargate";
import {PoolProp, priceData} from "@/app/coin/[token]/page";

interface ButtonSellTabsProps {
    ApiUrl?: string;
    AuthToken?: string;
    isWalletConnected?: boolean;
    tokenData: CoinAttributes;
    zigLeft: string;
    tokenPrice: number;
    pool?: PoolProp;
    PriceData: priceData
}

export default function BuySellTabs({ isWalletConnected, tokenData, ApiUrl, AuthToken, zigLeft, tokenPrice, pool, PriceData }: ButtonSellTabsProps) {
    const [activeTab, setActiveTab] = useState("tab1");
    const [buyAmount, setBuyAmount] = useState<string>("0");
    const [sellAmount, setSellAmount] = useState<string>("0");
    const { showPopup } = usePopup();
    const [loader, setloader] = useState(false);
    const [totalTokens, setTotalTokens] = useState<number>();
    const [totalSellTokens, setSellTotalTokens] = useState<number>();
    const [onSlippage, setSlippage] = useState(0);
    const [WalletAmount, SetWalletAmount] = useState<string>("");

    const { getOfflineSigner, address } = useChain(`${process.env.NEXT_PUBLIC_CHAIN_NAME}`, true);

    const handleBuyToken = async () => {
        setloader(true);
        try {
            if (pool?.trading_paused) {
                showPopup("Trading is currently paused for this token. This token is now on OroSwap.", "error");
                return;
            }

            if (!buyAmount || isNaN(Number(buyAmount)) || Number(buyAmount) <= 0) {
                showPopup("Amount must be greater than 0", "error");
                return;
            }

            const signer = await getOfflineSigner();
            const msg: BuyTokenMsg = {
                buy_token: {
                    symbol: tokenData.symbol,
                    name: tokenData.name,
                    slippage: (onSlippage / 100).toString()
                },
            };


            const txHash = await BuyTokenTx({
                msg,
                signer,
                amount: Number(buyAmount),
            });

            if (txHash) {
                const headers = AuthToken ? { Authorization: `Bearer ${AuthToken}` } : {};
                const result = await axios.post(`${ApiUrl}/coin/buy-coin/${txHash}`,
                    {
                        "base": tokenData.token
                    }, {
                    headers: headers
                }
                );
                if (result.status === 201) {
                    showPopup(result.data.message, 'success');
                    setBuyAmount("0")
                }
            }
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Something went wrong. Please try again.";
            showPopup(message, "error");
            setloader(false);
        } finally {
            setloader(false);
        }
    };

    const handleSaleToken = async () => {
        setloader(true);
        try {
            if (Number(PriceData.BondingStats.reserve) <= Number(PriceData.priceZig)) {
                showPopup('quota Unavailable - Low Level of Liquidity', "error");
                return;
            }
            const estimatedZig = Number(sellAmount) * tokenPrice;
            if (estimatedZig >= Number(PriceData.BondingStats.reserve)) {
                showPopup('quota Unavailable - Low Level of Liquidity', "error");
                setloader(false);
                return;
            }
            if (!sellAmount || isNaN(Number(sellAmount)) || Number(sellAmount) <= 0) {
                showPopup("Amount must be greater than 0", "error");
                return;
            }

            if (pool?.trading_paused) {
                showPopup("Trading is currently paused for this token. This token is now on OroSwap.", "error");
                return;
            }

            const signer = await getOfflineSigner();
            const SellToken = await SellTokenTx({
                signer,
                msg: {
                    sell_token: {
                        symbol: tokenData.symbol,
                        amount: sellAmount,
                        name: tokenData.name
                    },
                },
                base: tokenData.token
            });

            if (SellToken) {
                const headers = AuthToken ? { Authorization: `Bearer ${AuthToken}` } : {};
                const result = await axios.post(`${ApiUrl}/coin/sell-coin/${SellToken}`,
                    {
                        "base": tokenData.token
                    }, {
                    headers: headers
                }
                );
                if (result.status === 201) {
                    showPopup(result.data.message, 'success');
                    setSellAmount("0")
                }
            }
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Something went wrong. Please try again.";
            showPopup(message, "error");
        } finally {
            setloader(false);
        }
    };

    const imageUrl = tokenData?.logo || `https://memesfun.mypinata.cloud/ipfs/bafkreicgshszjb37waaku4ll5azvlxrsk7wsodg6fkdn5yohquhbbvv4cu`;

    useEffect(() => {
        const amountInzig = Number(buyAmount);
        const tokensToReceive = (amountInzig * 0.01234) / tokenPrice;
        setTotalTokens(Math.floor(tokensToReceive)) //1.234% of any transaction
    }, [tokenPrice, buyAmount]);

    useEffect(() => {
        const amountInSell = Number(sellAmount);
        const amount = amountInSell * tokenPrice;
        const feePercent = amount * 0.01234;
        const tokensToReceive = amount - feePercent;
        setSellTotalTokens(tokensToReceive) //1.234% of any transaction
    }, [tokenPrice, sellAmount]);

    const GetWalletAmount = async (denom: string) => {
        try {
            const signer = await getOfflineSigner();
            const [account] = await signer.getAccounts();
            const address = account.address;

            if (!address) throw new Error("Wallet not connected");

            const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ADDRESS!;

            const client = await StargateClient.connect(rpcEndpoint);
            const balance = await client.getBalance(address, denom);

            return balance.amount;
        } catch (e) {
            console.error("Error fetching wallet amount:", e);
            return undefined;
        }
    }

    const setBuyAmountZig = async (amount: string) => {
        const numericAmount = Number(amount);
        const numericZigLeft = Number(zigLeft);

        if (pool?.is_seven_percent && numericAmount > 0) {
            const tokenLeft = Number(process.env.NEXT_PUBLIC_ALLOCATED_SUPPLY) - Number(PriceData.Pool?.circulating_supply ?? 0);
            if (tokenLeft < Number(process.env.NEXT_PUBLIC_ALLOCATED_SUPPLY_7_PERCENT)) {
                showPopup('Max Token Limit Reached', "error");
                const zigAmount = tokenLeft * tokenPrice;
                setBuyAmount(zigAmount.toString());
                return;
            }
        }
        if (numericAmount > numericZigLeft) {
            if(pool?.is_seven_percent){
                showPopup('7% per wallet limit reached', "error");
            }else{
                showPopup('Exceeded the allocated supply!', "error");
            }
            setBuyAmount(numericZigLeft.toString());
            return;
        }

        setBuyAmount(amount);

        const WalletZig = await GetWalletAmount("uzig");
        SetWalletAmount(WalletZig ?? "0")
    }

    const setSellAmountDenom = async (amount: string) => {
        const amountToSell = await GetWalletAmount(tokenData.token);
        const walletAmount = Number(amountToSell);
        const inputAmount = Number(amount);
        const amountToSellDenom = Math.floor(walletAmount * inputAmount);

        if(Number(PriceData.BondingStats.reserve) <= Number(PriceData.priceZig)){
            showPopup('quota Unavailable - Low Level of Liquidity', "error");
            setSellAmount(amountToSellDenom.toString());
            return;
        }

        if (isNaN(walletAmount) || isNaN(inputAmount)) {
            console.error("Invalid number inputs");
            return;
        }

        if (walletAmount <= 0) {
            showPopup('Insufficient Balance!', "error");
            return;
        }


        setSellAmount(amountToSellDenom.toString());
    }

    const isTradingPaused = Boolean(pool?.trading_paused);

    return (
        <div className={`w-full max-w-md mx-auto graph_tabs`}>

            {/* Tabs Navigation */}
            <div className="flex border-b tabs_head">
                {["Buy", "Sell"].map((label, index) => {
                    const tabKey = `tab${index + 1}`;
                    return (
                        <button
                            key={tabKey}
                            onClick={() => setActiveTab(tabKey)}
                            className={`nav_btn ${activeTab === tabKey ? "active_tab" : "not_active"}`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Tabs Content */}
            <div className="prof_tab_Cont">
                {activeTab === "tab1" && (
                    <div className="cont">
                        <div className="d-flex justify-content-between">
                            <div className={"graduate_Para"}>
                                <p className={"m-0"}>You will get {totalTokens?.toFixed(3)} coins.</p>
                            </div>
                            <span><Slippage value={onSlippage} onChange={setSlippage} /></span>
                        </div>

                        <div className="zig_box">
                            <span>
                                <input
                                    type="text"
                                    value={buyAmount}
                                    onChange={(e) => {
                                        const raw = e.target.value;

                                        const validInput = raw.replace(/[^0-9.]/g, '');
                                        const parts = validInput.split('.');
                                        if (parts.length > 2) return;

                                        if (parts.length === 2 && parts[1].length > 6) {
                                            showPopup("Max 6 decimal places allowed", "error");
                                            return;
                                        }

                                        setBuyAmount(validInput);

                                        if (validInput === "" || validInput === ".") return;

                                        const value = parseFloat(validInput);
                                        if (isNaN(value) || value === 0) return;

                                        if (value < 0.9) {
                                            setBuyAmount('1');
                                            showPopup("Amount must be at least 1 zig", "error");
                                            return;
                                        }

                                        if (value > Number(zigLeft)) {
                                            if(pool?.is_seven_percent){
                                                showPopup('7% per wallet limit reached', "error");
                                            }else{
                                                showPopup('Exceeded the allocated supply!', "error");
                                            }
                                            setBuyAmount(`${zigLeft}`);
                                            return;
                                        }
                                    }}
                                />
                            </span>
                            <div className="zig_img">
                                <span>ZIG</span>
                                <Image alt="" width={46} height={46} src={'/assets/img/zig.png'} />
                            </div>
                        </div>
                        <div className="zig_btn">
                            <button onClick={() => setBuyAmountZig("0")}>Reset</button>
                            <button onClick={() => setBuyAmountZig('20')}>20 Zig</button>
                            <button onClick={() => setBuyAmountZig('25')}>25 Zig</button>
                            {/*<button onClick={() => setBuyAmountZig('250')}>250 Zig</button>*/}
                            <button className={WalletAmount} onClick={() => setBuyAmountZig(`${zigLeft}`)}>max Zig</button>
                        </div>

                        {isWalletConnected && address && (
                            <div className="connect_wal">
                                <button className="theme_btn"
                                    onClick={handleBuyToken}
                                    disabled={loader || isTradingPaused}
                                    style={{
                                        cursor: isTradingPaused ? "not-allowed" : "pointer",
                                        opacity: isTradingPaused ? 0.5 : 1
                                    }}
                                >
                                    {loader ? "Purchasing Coin..." : "Buy Coin"}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "tab2" && (
                    <div className="cont">
                        <div className="d-flex justify-content-start">
                            <div className={"graduate_Para"}>
                                <p className={"m-0"}>You will get {totalSellTokens?.toFixed(3)} Zig.</p>
                            </div>
                            {/*<span><Slippage value={onSlippage} onChange={setSlippage}/></span>*/}
                        </div>
                        <div className="zig_box">
                            <span>
                                <input
                                    type="text"
                                    value={sellAmount}
                                    onChange={(e) => {
                                        let raw = e.target.value;
                                        const validInput = raw.replace(/[^0-9.]/g, '');
                                        const parts = validInput.split('.');
                                        if (parts.length > 2) return;
                                        if (parts.length === 2 && parts[1].length > 6) {
                                            showPopup("Max 6 decimal places allowed", "error");
                                            return;
                                        }
                                        if (validInput.startsWith("0") && validInput.length > 1 && !validInput.startsWith("0.")) {
                                            raw = validInput.replace(/^0+/, '');
                                        } else {
                                            raw = validInput;
                                        }
                                        if (raw === "" || raw === ".") {
                                            setSellAmount("0");
                                            return;
                                        }
                                        const value = Number(raw);
                                        if (isNaN(value)) return;
                                        if (value <= 0) {
                                            showPopup("Amount must be greater than 0", "error");
                                            return;
                                        }
                                        setSellAmount(raw);
                                    }}
                                />
                            </span>
                            <div className="zig_img">
                                <span>{tokenData.symbol}</span>
                                <Image
                                    loader={ipfsLoader}
                                    src={imageUrl}
                                    alt={tokenData?.name ? tokenData.name : "Loading..."}
                                    width={46}
                                    height={46}
                                    crossOrigin="anonymous"
                                />
                            </div>
                        </div>

                        <div className="zig_btn">
                            <button onClick={() => setSellAmountDenom("0")}>Reset</button>
                            <button onClick={() => setSellAmountDenom("0.25")}>25%</button>
                            <button onClick={() => setSellAmountDenom("0.50")}>50%</button>
                            <button onClick={() => setSellAmountDenom("1")}>100%</button>
                        </div>

                        {isWalletConnected && address && (
                            <div className="connect_wal">
                                <button className="theme_btn"
                                    onClick={handleSaleToken}
                                    disabled={loader || isTradingPaused}
                                    style={{
                                        cursor: isTradingPaused ? "not-allowed" : "pointer",
                                        opacity: isTradingPaused ? 0.5 : 1
                                    }}
                                >
                                    {loader ? "Selling Coin..." : "Sell Coin"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {isTradingPaused && (
                <div className="text-red-500 text-sm text-center mb-2" style={{ color: "#ff0000" }}>
                    Trading is paused as the bonding curve is complete. This token is migrating to <a href="https://testnet.oroswap.org/pools" target="_blank" rel="noopener noreferrer">OroSwap</a>
                </div>
            )}
        </div>
    );
}
