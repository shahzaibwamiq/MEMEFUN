"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaCheck, FaRegCopy } from "react-icons/fa";
import MiniChart from "@/components/charts/MiniChart";
import WishlistButton from "@/components/ui/buttons/WishlistButton";
import Profileprogressbar from "@/components/ui/progressbar/Profileprogressbar";
import Filtermodal from "../ui/modals/Filtermodal";
import { CoinAttributes } from "@/utils/Interfaces/CoinInterfaces";
import { ipfsLoader } from "@/utils/ipfsLoaders/ipfsLoader";
import {CalculateBondingCurve, CalculateMarketCap} from "@/utils/Hooks/CalulatePrices";
import {fetchZigPrice} from "@/utils/ZigChain/CoinPrices/zigPrice/ZigPrice";
import {paths} from "@/paths";
import {useRouter} from "next/navigation";

interface NewlycreatedProps {
    inputValue: string;
    isAuthenticated: boolean;
    ApiUrl?: string;
    AuthToken?: string;
    newlyCreatedData: CoinAttributes[];
}

type OhlcItem = {
    time: string | number;
    open: string | number;
    high: string | number;
    low: string | number;
    close: string | number;
    volume: string | number;
};

export default function Newlycreated({
                                         inputValue,
                                         isAuthenticated,
                                         ApiUrl,
                                         AuthToken,
                                         newlyCreatedData,
                                     }: NewlycreatedProps) {
    const router = useRouter();
    const [copied, setCopied] = useState<string | null>(null);
    const [localList, setLocalList] = useState<CoinAttributes[]>(newlyCreatedData);
    const [bondingMap, setBondingMap] = useState<Record<string, number>>({});
    const [MarketCap, setMarketCap] = useState<Record<string, number>>({});
    const [CoinVolumn, setCoinVolumn] = useState<Record<string, number>>({});


    useEffect(() => {
        setLocalList(newlyCreatedData);
    }, [newlyCreatedData]);


    const handleCopyAddress = async (address?: string) => {
        if (address) {
            try {
                await navigator.clipboard.writeText(address);
                setCopied(address);
                setTimeout(() => setCopied(null), 2000);
            } catch (err) {
                console.error("Failed to copy address", err);
            }
        }
    };

    useEffect(() => {
        const fetchBondings = async () => {
            const map: Record<string, number> = {};
            for (const token of localList) {
                const zigCollect = Number(token?.TokenPrice?.market_cap) / 1_000_000;

                const TargetZig = Number(token?.targetAmount) / 1_000_000;

                const bonding = await CalculateBondingCurve({
                    zigCollected: zigCollect ?? 0,
                    targetPrice: TargetZig
                });
                if (bonding !== null) {
                    map[token.token] = bonding;
                }
            }
            setBondingMap(map);
        };

        const fetchMarketCap = async () => {
            const map: Record<string, number> = {};
            const price = await fetchZigPrice();
            for (const token of localList) {

                const marketCap = await CalculateMarketCap({
                    market_cap: Number(token.TokenPrice?.market_cap) ?? 0,
                    zigPrice: price
                });
                if (marketCap !== null) {
                    map[token.token] = marketCap;
                }
            }
            setMarketCap(map);
        };

        const fetchVolumn = async () => {
            const map: Record<string, number> = {};
            const price = await fetchZigPrice();
            for (const token of localList) {

                const calculateVolumn = (Number(token?.TokenPrice?.volume) / 1_000_000) *  price
                if (calculateVolumn !== null) {
                    map[token.token] = calculateVolumn;
                }
            }
            setCoinVolumn(map);
        };

        fetchVolumn();
        fetchMarketCap();
        fetchBondings();
    }, [localList]);

    const handleCoinClick = (token: string) => {
        requestAnimationFrame(() => {
            router.push(`${paths.coin}/${encodeURIComponent(token)}`);
        });
    };


    return (
        <div className="adv_lst">
            <div className="adv_head">
                <h4>Newly Created</h4>
                <Filtermodal />
            </div>

            {localList.length === 0 ? (
                <p className="text-center mt-4" style={{ fontSize: "14px" }}>
                    No newly created tokens found.
                </p>
            ) : (
                localList.map((token, index) => {
                    const imageUrl = token?.logo || `https://memesfun.mypinata.cloud/ipfs/bafkreicgshszjb37waaku4ll5azvlxrsk7wsodg6fkdn5yohquhbbvv4cu`;
                    const bonding = bondingMap[token.token] ?? 0;
                    const market = MarketCap[token.token];
                    const volumn = CoinVolumn[token.token];

                    const chartData = (token?.TokenPrice?.price_ohlc_history as OhlcItem[] || []).map((entry) => ({
                        time: Number(entry.time),
                        open: Number(entry.open),
                        high: Number(entry.high),
                        low: Number(entry.low),
                        close: Number(entry.close),
                        volume: Number(entry.volume),
                    }));
                    return (
                        <div
                            className={`advanc_box`}
                            key={index}
                        >
                            <div className="box_head d-flex">
                                <h4 onClick={() => handleCoinClick(token.token)}>{token?.name}</h4>
                                <div className="btn_sear d-flex">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopyAddress(token?.token);
                                        }}
                                    >
                                        {token?.token === copied ? <FaCheck /> : <FaRegCopy />}
                                    </button>
                                    <button>
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </button>
                                    {isAuthenticated && AuthToken && ApiUrl && (
                                        <div className="wishlist_fvt">
                                            <WishlistButton
                                                itemId={String(token?.token)}
                                                token={AuthToken}
                                                ApiUrl={ApiUrl}
                                                isAdded={(token?.wishlists[0]?.id ?? 0) > 0}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="adv_prof">
                                <div className="info_box d-flex">
                                    <Image
                                        loader={ipfsLoader}
                                        src={imageUrl}
                                        alt=""
                                        width={66}
                                        height={56}
                                    />
                                    <ul className="info_ls">
                                        <li><span>MC:</span>${market?.toFixed(3)}</li>
                                        <li><span>VOL:</span>${volumn?.toFixed(3)}</li>
                                        <li><span>Tx:</span>{token?.tradeCount}</li>
                                        <li><span className="icon_ls"><i className="fa-regular fa-user"></i></span>{token?.HoldersCount}</li>
                                        <li><span className="icon_ls"><i className="fas fa-crown"></i></span>2%</li>
                                        <li><span className="icon_ls"><i className="fas fa-hat-wizard"></i></span>3%</li>
                                    </ul>
                                </div>
                                <div className="chart_box d-flex align-items-center">
                                    <MiniChart data={chartData} />
                                    <div className="st_box">
                                        <span>{inputValue}</span>
                                        <Image src={'/assets/img/zig.png'} alt="" height={25} width={25} />
                                    </div>
                                </div>
                                <div className="prog_box">
                                    <span className="frst">{bonding?.toFixed(2)}%</span>
                                    <Profileprogressbar progress={Number(bonding?.toFixed(2))} />
                                    <span className="lst">100%</span>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
