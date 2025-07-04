'use client'

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import Profileprogressbar from "@/components/ui/progressbar/Profileprogressbar";
import { useRouter } from "next/navigation";
import { paths } from "@/paths";
import { ipfsLoader } from "@/utils/ipfsLoaders/ipfsLoader";
import {useEffect, useState} from "react";
import WishlistButton from "@/components/ui/buttons/WishlistButton";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {CoinBoxsProps} from "@/components/ui/boxs/CoinBoxs";
import {FaCheck, FaRegCopy} from "react-icons/fa";

dayjs.extend(relativeTime);


export default function AdminCoinBoxs({
                                          data,
                                          ApiUrl,
                                          isAuthenticated,
                                          AuthToken,
                                          error,
                                          isLoading,
                                      }: CoinBoxsProps) {
    const router = useRouter();
    const [copied, setCopied] = useState<string | null>(null);

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
                                <div className="prof_prog" style={{ width: `20%`, height: "100%" }}></div>
                            </div>
                            <span className="rounded-full percent prof_per">20%</span>
                        </div>

                        <div className="animated_border">
                            <div className="profile_box">
                                {isAuthenticated && AuthToken && ApiUrl && (
                                    <div className="star_icon">
                                        <WishlistButton itemId={token.token} token={AuthToken} ApiUrl={ApiUrl} isAdded={(token?.wishlists[0]?.id ?? 0) > 0} />
                                    </div>
                                )}


                                <div className="name_token">
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
                                    <span>MC: $000</span> &nbsp; | &nbsp; <span>$13</span>
                                </div>

                                <div className="text-center trans_info">
                                    <FontAwesomeIcon icon={faClock} /> {token?.created_at ? dayjs(token?.created_at).fromNow() : 'Just now'} &nbsp; | &nbsp; {token?.tradeCount} txs &nbsp; | &nbsp; {token?.commentCount} Replies
                                </div>

                                <Profileprogressbar progress={20} />

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
