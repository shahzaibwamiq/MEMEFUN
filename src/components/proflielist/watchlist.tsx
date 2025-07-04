"use client";
import Image from "next/image";

import Profileprogressbar from "@/components/ui/progressbar/Profileprogressbar";
import Filtermodal from "../ui/modals/Filtermodal";
import {UserWishlistAttributes} from "@/utils/Interfaces/CoinInterfaces";
import {ipfsLoader} from "@/utils/ipfsLoaders/ipfsLoader";
// import MiniChart from "@/components/charts/MiniChart";
import {FaCheck, FaRegCopy} from "react-icons/fa";
import {useEffect, useState} from "react";
import WishlistButton from "@/components/ui/buttons/WishlistButton";

interface WatchlistProps {
    inputValue : string;
    wishlistData: UserWishlistAttributes[];
    isLoading: boolean;
    isAuthenticated : boolean;
    ApiUrl?: string;
    AuthToken?: string;
}

export const dummyData = [
    { time: 1719240000, open: 90, high: 105, low: 85, close: 100 },
    { time: 1719240060, open: 100, high: 110, low: 95, close: 108 },
    { time: 1719240120, open: 108, high: 112, low: 102, close: 104 },
    { time: 1719240180, open: 104, high: 106, low: 100, close: 101 },
    { time: 1719240240, open: 90, high: 105, low: 85, close: 100 },
    { time: 1719240300, open: 100, high: 110, low: 95, close: 108 },
    { time: 1719240360, open: 108, high: 112, low: 102, close: 104 },
    { time: 1719240420, open: 104, high: 106, low: 100, close: 101 },
    { time: 1719240480, open: 100, high: 110, low: 95, close: 108 },
    { time: 1719240540, open: 104, high: 106, low: 100, close: 101 },
    { time: 1719240600, open: 104, high: 106, low: 100, close: 101 },
    { time: 1719240660, open: 108, high: 112, low: 102, close: 104 },
];

export default function Watchlist({inputValue, wishlistData, isLoading, isAuthenticated, AuthToken, ApiUrl}:WatchlistProps) {
    const [copied, setCopied] = useState<string | null>(null);
    const [localWishlist, setLocalWishlist] = useState(wishlistData);
    const [removingItems, setRemovingItems] = useState<{ [token: string]: boolean }>({});

    useEffect(() => {
        setLocalWishlist(wishlistData);
    }, [wishlistData]);

    const handleRemoveItem = (tokenAddress: string) => {
        setRemovingItems((prev) => ({ ...prev, [tokenAddress]: true }));

        setTimeout(() => {
            setLocalWishlist((prev) => prev.filter((item) => item.coin?.token !== tokenAddress));
            setRemovingItems((prev) => {
                const copy = { ...prev };
                delete copy[tokenAddress];
                return copy;
            });
        }, 600); // match CSS transition duration
    };



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
    <>
      <div className="adv_lst">
        <div className="adv_head">
          <h4>Watchlist</h4>
          <Filtermodal />
        </div>

          {!isAuthenticated ? (
              <p className="text-center mt-4" style={{ fontSize: '14px' }}>
                    Connect Your Wallet to Manage your Wishlist.
              </p>
          ): isLoading  ? (
              <p className="text-center mt-4" style={{ fontSize: '14px' }}>Loading...</p>
          ) : isAuthenticated && localWishlist.length > 0 ? (

              localWishlist.map((token, index) => {
                  const imageUrl = token?.coin?.logo || `https://memesfun.mypinata.cloud/ipfs/bafkreicgshszjb37waaku4ll5azvlxrsk7wsodg6fkdn5yohquhbbvv4cu`;

                  return (
                      <div className={`${index} advanc_box ${removingItems[token.coin?.token || ""] ? 'fade-out' : ''}`} key={token.coin?.token}>
                          <div className="box_head d-flex">
                              <h4>
                                  {token.coin?.name}
                              </h4>
                              <div className="btn_sear d-flex">
                                  <button
                                      className="ml-2 cursor-pointer bg-transparent border-none outline-none"
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopyAddress(token?.coin?.token);
                                      }}
                                  >
                                      {token?.coin?.token === copied ? <FaCheck /> : <FaRegCopy />}
                                  </button>
                                  <button>
                                      <i className="fa-solid fa-magnifying-glass"></i>
                                  </button>
                                  {isAuthenticated && AuthToken && ApiUrl && (
                                      <div className="wishlist_fvt">
                                          <WishlistButton
                                              itemId={String(token?.coin?.token)}
                                              token={AuthToken}
                                              ApiUrl={ApiUrl}
                                              isAdded={(token?.id ?? 0) > 0}
                                              onRemoveFromUI={handleRemoveItem}
                                          />
                                      </div>
                                  )}
                              </div>
                          </div>
                          <div className="adv_prof" >
                              <div className="info_box d-flex">
                                  <Image
                                      loader={ipfsLoader}
                                      src={imageUrl}
                                      alt=""
                                      width={66}
                                      height={56}
                                  />
                                  <ul className="info_ls">
                                      <li><span>MC:</span>$4.8K</li>
                                      <li><span>VOL:</span>$731</li>
                                      <li><span>Tx:</span> {token?.coin?.TradesCount}</li>
                                      <li><span className="icon_ls"><i className="fa-regular fa-user"></i></span>{token?.coin?.HoldersCount}</li>
                                      <li><span className="icon_ls"><i className="fas fa-crown"></i></span>2%</li>
                                      <li><span className="icon_ls"><i className="fas fa-hat-wizard"></i></span>3%</li>
                                  </ul>
                              </div>
                              <div className="chart_box d-flex align-items-center">
                                  {/*<MiniChart data={dummyData} />*/}
                                  {/*<Image src={'/assets/img/graph.png'} alt="" height={40} width={97} />*/}
                                  <div className="st_box">
                                      <span>{inputValue}</span>
                                      <Image src={'/assets/img/zig.png'} alt="" height={25} width={25} />
                                  </div>
                              </div>
                              <div className="prog_box">
                                  <span className="frst">0%</span>
                                  {/* Progress Bar */}
                                  <Profileprogressbar progress={36} />
                                  <span className="lst">100%</span>
                              </div>
                          </div>
                      </div>
                  )
              })

          ):(
              <p className="text-center mt-4" style={{ fontSize: '14px' }}>
                  No items in your watchlist.
              </p>
          )}

      </div>
    </>
  );
}
