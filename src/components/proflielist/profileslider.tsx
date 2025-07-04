"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock} from "@fortawesome/free-solid-svg-icons";
import Profileprogressbar from "@/components/ui/progressbar/Profileprogressbar";
import {CoinBoxsProps} from "@/components/ui/boxs/CoinBoxs";
import {useRouter} from "next/navigation";
import { paths } from "@/paths";
import { ipfsLoader } from "@/utils/ipfsLoaders/ipfsLoader";
import WishlistButton from "@/components/ui/buttons/WishlistButton";
import dayjs from "dayjs";
import {CalculateBondingCurve, CalculateCoinPriceUsd, CalculateMarketCap} from "@/utils/Hooks/CalulatePrices";
import {fetchZigPrice} from "@/utils/ZigChain/CoinPrices/zigPrice/ZigPrice";
import CircularProgress from "@/components/ui/progressbar/BondingCurveProgressBar";
import {formatPrice} from "@/utils/formatPrice";


const ProfileSlider = ({
                           data,
                           error,
                           isLoading,
                            AuthToken,
                            ApiUrl,
                            isAuthenticated,
                       }: CoinBoxsProps) => {
    const [isClient, setIsClient] = useState(false);
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
        setIsClient(true);
    }, []);

    const router = useRouter();


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




    if (!isClient) return null; // Prevents hydration errors

    return (
        <div className="mySwiper">
            <Swiper
                modules={[Navigation, Pagination]}
                slidesPerView={2}
                spaceBetween={20}
                loop={true}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                    768: { slidesPerView: 2 },
                    480: { slidesPerView: 1 },
                }}
            >
                {data.map((token) => {
                    const tokenName = token?.name;
                    const imageUrl = token.logo || `https://memesfun.mypinata.cloud/ipfs/bafkreicgshszjb37waaku4ll5azvlxrsk7wsodg6fkdn5yohquhbbvv4cu`;
                    const bonding = bondingMap[token.token] ?? 0;
                    const market = MarketCap[token.token];
                    const CoinPriceUsd = CoinPriceUzig[token.token];

                    return(
                        <SwiperSlide key={token.symbol} className="prof_box_animation">
                            <div className=" prof_box" onClick={() => handleCoinClick(token.token)}>
                                <div className="relative">
                                    <Image
                                        loader={ipfsLoader}
                                        src={imageUrl}
                                        alt={tokenName}
                                        width={60}
                                        height={60}
                                        className="rounded-full profile_img"
                                    />

                                    <CircularProgress progress={Math.round(progressMap[token.token] ?? 0)} />
                                </div>
                                <span className="rounded-full percent prof_per">{Math.round((progressMap[token.token] ?? 0))}%</span>
                            </div>
                            <div className="animated_border">
                                <div className="profile_box">
                                    {/* Profile Image & Progress Badge */}

                                    {isAuthenticated && AuthToken && ApiUrl && (
                                        <div className="star_icon">
                                            <WishlistButton itemId={token.token} token={AuthToken} ApiUrl={ApiUrl} isAdded={(token?.wishlists[0]?.id ?? 0) > 0} />
                                        </div>
                                    )}
                                    <div className="name_token" onClick={() => handleCoinClick(token.token)}>
                                        <h2 className="text-center">{tokenName}</h2>
                                    </div>
                                    <p>
                                        {token.description ? `${token.description.slice(0, 30)}${token.description.length > 100 ? '...' : ''}` : ""}
                                    </p>

                                    <div className="flex items-center justify-center amount">
                                        <Image
                                            alt=""
                                            src="/assets/img/profile/leaf.png"
                                            width={30}
                                            height={30}
                                        />
                                        <span>{bonding} MC: {formatPrice(market ?? 0)}</span> &nbsp; | &nbsp; <span>{formatPrice(CoinPriceUsd ?? 0)}</span>
                                    </div>

                                    {/* Transaction Info */}
                                    <div className=" text-center trans_info">
                                        <FontAwesomeIcon icon={faClock} /> {token?.created_at ? dayjs(token?.created_at).fromNow() : 'Just now'} &nbsp; | &nbsp; {token?.tradeCount} txs &nbsp; | &nbsp; {token?.commentCount} Replies
                                    </div>

                                    {/* Progress Bar */}
                                    <Profileprogressbar progress={36}/>

                                    {/* Icons */}
                                    <div className="flex justify-center gap-5 mt-3 btm_icon">
                                        {renderIconLink(token?.website, "fa-solid fa-globe")}
                                        {renderIconLink(token?.telegram, "fa-brands fa-telegram")}
                                        {renderIconLink(token?.twitter, "fa-brands fa-x-twitter")}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        )
                })}
            </Swiper>
        </div>
    );
};

export default ProfileSlider;
