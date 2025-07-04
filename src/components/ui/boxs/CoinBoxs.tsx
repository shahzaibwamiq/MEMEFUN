'use client'

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { paths } from "@/paths";
import { ipfsLoader } from "@/utils/ipfsLoaders/ipfsLoader";
import {useEffect, useState} from "react";
import WishlistButton from "@/components/ui/buttons/WishlistButton";
import {CoinAttributes} from "@/utils/Interfaces/CoinInterfaces";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {FaCheck, FaRegCopy} from "react-icons/fa";
import {CalculateBondingCurve, CalculateCoinPriceUsd, CalculateMarketCap} from "@/utils/Hooks/CalulatePrices";
import CircularProgress from "@/components/ui/progressbar/BondingCurveProgressBar";
import {fetchZigPrice} from "@/utils/ZigChain/CoinPrices/zigPrice/ZigPrice";
import {formatPrice} from "@/utils/formatPrice";

dayjs.extend(relativeTime);

export function resolveIPFS(uri?: string): string {
    if (!uri || typeof uri !== "string") return "";
    return uri.startsWith("ipfs://")
        ? `https://ipfs.io/ipfs/${uri.replace("ipfs://", "")}`
        : uri;
}

export interface CoinBoxsProps {
    data: CoinAttributes[];
    rowsPerPage?: number;
    error: Error | null;
    isLoading: boolean;
    total?: number;
    page?: number;
    ApiUrl?: string;
    isAuthenticated?: boolean;
    AuthToken?: string;
}
export default function CoinBoxs({
     data,
     ApiUrl,
     isAuthenticated,
     AuthToken,
     error,
     isLoading,
 }: CoinBoxsProps) {
    const router = useRouter();
    const [copied, setCopied] = useState<string | null>(null);
    const [bondingMap, setBondingMap] = useState<Record<string, number>>({});
    const [MarketCap, setMarketCap] = useState<Record<string, number>>({});
    const [CoinPriceUzig, setCoinPriceUzig] = useState<Record<string, number>>({});
    const [progressMap, setProgressMap] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchBondings = async () => {
            const map: Record<string, number> = {};
            for (const token of data) {
                const zigCollect = Number(token?.TokenPrice?.market_cap) / 1_000_000;

                const TargetZig = Number(token.targetAmount) / 1_000_000;

                const bonding = await CalculateBondingCurve({
                    zigCollected: zigCollect ?? 0,
                    targetPrice: TargetZig
                });
                if (bonding !== null) {
                    map[token.token] = bonding;
                    let current = 0;
                    const target = bonding;
                    const duration = 1000; // ms
                    const interval = 10;
                    const steps = duration / interval;
                    const increment = target / steps;

                    const animate = () => {
                        current += increment;
                        if (current >= target) {
                            setProgressMap(prev => ({ ...prev, [token.token]: target }));
                        } else {
                            setProgressMap(prev => ({ ...prev, [token.token]: current }));
                            setTimeout(animate, interval);
                        }
                    };
                    animate();
                }
            }
            setBondingMap(map);
        };

        const fetchMarketCap = async () => {
            const map: Record<string, number> = {};
            const price = await fetchZigPrice();
            for (const token of data) {

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

        const fetchCoinPrice = async () => {
            const map: Record<string, number> = {};
            const price = await fetchZigPrice();
            for (const token of data) {

                const CoinPrice = await CalculateCoinPriceUsd({
                    coinPriceUzig: Number(token.TokenPrice?.token_price),
                    zigPrice: price
                });
                if (CoinPrice !== null) {
                    map[token.token] = CoinPrice;
                }
            }
            setCoinPriceUzig(map);
        };

        fetchCoinPrice();
        fetchMarketCap();
        fetchBondings();
    }, [data]);


    useEffect(() => {
        data.forEach(token => {
            if (token.token) {
                router.prefetch(`${paths.coin}/${encodeURIComponent(token.token)}`);
            }
        });
    }, [data, router]);

    const handleCoinClick = (token: string) => {
    requestAnimationFrame(() => {
        router.push(`${paths.coin}/${encodeURIComponent(token)}`);
    });
};

    if (error) return <p className="text-center text-red-500 w-full">Error loading tokens.</p>;
    if (isLoading) return <p className="text-center w-full">Loading tokens...</p>;
    if (!isLoading && data.length === 0) return <p className="text-center w-full">No tokens found</p>;

    const renderIconLink = (url: string | undefined, iconClass: string) => (
    url ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
            <i className={iconClass}></i>
        </a>
    ) : null
);

    const handleCopyAddress = async (address: string | undefined) => {
        if (address) {
            try {
                await navigator.clipboard.writeText(address);
                setCopied(address);
                setTimeout(() => setCopied(null), 2000);
            } catch (err) {
                console.error("Failed to copy!", err);
            }
        }
    };

    return (
        <div className="row prof_data">
            {data.map((token) => {
                const tokenName = token?.name;
                const imageUrl = token.logo || `https://memesfun.mypinata.cloud/ipfs/bafkreicgshszjb37waaku4ll5azvlxrsk7wsodg6fkdn5yohquhbbvv4cu`;
                const bonding = bondingMap[token.token] ?? 0;
                const market = MarketCap[token.token];
                const CoinPriceUsd = CoinPriceUzig[token.token];

                console.log(bonding)

                return (
                    <div
                        key={token.token}
                        className="col-4 prof_box_animation"
                        // style={{ cursor: "pointer" }}
                    >
                        <div className="prof_box" onClick={() => handleCoinClick(token.token)}>
                            <div className="relative">
                                <Image
                                    loader={ipfsLoader}
                                    src={imageUrl}
                                    alt={tokenName}
                                    width={60}
                                    height={60}
                                    className="rounded-full profile_img"
                                    crossOrigin="anonymous"
                                />
                                <CircularProgress progress={Math.round(progressMap[token.token] ?? 0)} />
                            </div>
                            <span className="rounded-full percent prof_per">{Math.round((progressMap[token.token] ?? 0))}%</span>
                        </div>

                        <div className="animated_border">
                            <div className="profile_box">
                                {isAuthenticated && AuthToken && ApiUrl && (
                                    <div className="star_icon">
                                        <WishlistButton itemId={token.token} token={AuthToken} ApiUrl={ApiUrl} isAdded={token?.wishlists?.length > 0}/>
                                    </div>
                                )}


                                <div className="name_token" >
                                    <h2 className="text-center" onClick={() => handleCoinClick(token.token)}>{tokenName}</h2>
                                    <button
                                        className="ml-2 cursor-pointer bg-transparent border-none outline-none"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent card click
                                            handleCopyAddress(token?.token);
                                        }}
                                    >
                                      <span>
                                        {token?.token === copied ? <FaCheck /> : <FaRegCopy />}
                                       
                                      </span>
                                    </button>
                                    <button className="add_btn">
                                      <i className="fa-solid fa-plus"></i>
                                    </button>
                                </div>

                                <p>{token.description ? `${token.description.slice(0, 30)}${token.description.length > 100 ? '...' : ''}` : ""}</p>

                                <div className="flex items-center justify-center amount">
                                    <Image alt="" src="/assets/img/profile/leaf.png" width={30} height={30} />
                                    <span>MC: {formatPrice(market ?? 0)}</span> &nbsp; | &nbsp; <span>{formatPrice(CoinPriceUsd ?? 0)}</span>
                                </div>

                                <div className="text-center trans_info">
                                    <FontAwesomeIcon icon={faClock} /> {token?.created_at ? dayjs(token?.created_at).fromNow() : 'Just now'} &nbsp; | &nbsp; {token?.tradeCount} txs &nbsp; | &nbsp; {token?.commentCount} Replies
                                </div>

                                <div className="flex justify-center gap-5 mt-3 btm_icon">
                                    {renderIconLink(token?.website, "fa-solid fa-globe")}
                                    {renderIconLink(token?.telegram, "fa-brands fa-telegram")}
                                    {renderIconLink(token?.twitter, "fa-brands fa-x-twitter")}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
