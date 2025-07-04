"use client";
import Breadcrum from "@/components/ui/breadcrum/Breadcrum";
import Coindetailfilter from "@/components/ui/Filters/coindetailfilter";
import ProgressBar from "@/components/ui/progressbar/Profileprogressbar";
import CoinTabs from "@/components/ui/Tabs/CoinTabs";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { shortenAddress } from "@/utils/AddressShortner";
import Link from "next/link";
import { paths } from "@/paths";
// import Slippage from "@/components/ui/modals/Slippage";
import BuySellTabs from "@/components/ui/Tabs/BuySellTabs";
import { usePopup } from "@/providers/PopupProvider";
import Loader from "@/components/ui/common/Loader";
import { notFound } from "next/navigation";
import { ipfsLoader } from "@/utils/ipfsLoaders/ipfsLoader";
import WishlistButton from "@/components/ui/buttons/WishlistButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import { CoinAttributes, HoldersAttributes } from "@/utils/Interfaces/CoinInterfaces";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useChain } from "@cosmos-kit/react";
import { useSocket } from "@/providers/SocketProvider";
import { GraphSocketMsg } from "@/components/ui/Tabs/GraphTabs";
import { CandleData } from "@/components/charts/tradingChart";
import { fetchZigPrice } from "@/utils/ZigChain/CoinPrices/zigPrice/ZigPrice";
import { FaCheck, FaRegCopy } from "react-icons/fa";
import HolderBox from "@/components/coinSections/holderbox";
import { CalculateBondingCurve } from "@/utils/Hooks/CalulatePrices";
import { formatPrice } from "@/utils/formatPrice";
import AddToWalletButton from "@/components/ui/buttons/AddTokenButton";

dayjs.extend(relativeTime);

export interface priceData {
  marketVolume: number;
  marketCap: number;
  marketCapZig: number;
  Liquidity: number;
  priceUsd?: number;
  priceZig?: number;
  BondingStats: BondingStatsProp,
  Pool?: PoolProp,
  PoolSupply?: number;
  TargetPriceUsd: number;
  TargetPriceZig: number;
}

export interface BondingStatsProp {
  supply: string,
  reserve: string,
  basePrice: string,
  steepness: string,
  totalBought: string,
  totalSold: string
}

export interface PoolProp {
  circulating_supply: string;
  creator: string;
  graduated: boolean;
  is_bonding: boolean;
  is_seven_percent: boolean | null;
  migration_initiated: boolean;
  migration_timestamp: string | null;
  reserve_zigs: string;
  symbol: string;
  trading_paused: boolean;
}

interface PriceSocketMsg {
  type: string;
  data: { Price: priceData[]; new?: boolean };
}


export default function CoinDetails() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const { address, openView, isWalletConnected } = useChain(`${process.env.NEXT_PUBLIC_CHAIN_NAME}`, true);
  const { socket } = useSocket();

  const params = useParams<{ token: string }>();
  const token = decodeURIComponent(params.token);
  const { showPopup } = usePopup();
  const ApiUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;
  const AuthToken: string | null = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const rowsPerPage = 5;

  const [page, setpage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHolders, setTotalHolders] = useState(1);
  const [Holder, setHolder] = useState<HoldersAttributes[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const hasFetched = useRef(false);
  const [data, setData] = useState<CoinAttributes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [PriceData, setPriceData] = useState<priceData[]>([]);
  const [UserAmount, setUserAmount] = useState(0);
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [TotalTxs, setTotalTxs] = useState("0");

  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const lastPriceRef = useRef<number | null>(null);
  const [priceDirection, setPriceDirection] = useState<"up" | "down" | "same">("same");
  const [zigPrice, setZigPrice] = useState<number>(0);
  const [collectedZig, setCollectedZig] = useState<number>(0);
  const [leftZig, setLeftZig] = useState<string>("0");
  // const [ConstantAmount, SetConstantAmount] = useState<number>(0);
  const [bondingCurve, SetbondingCurve] = useState<number>(1);
  const [copied, setCopied] = useState<string | null>(null);


  const handleModelOpen = () => {
    openView();
  };

  useEffect(() => {
    document.body.classList.add("dashboard");

    return () => {
      document.body.classList.remove("dashboard");
    };
  }, []);

  useEffect(() => {
    if (!token || hasFetched.current) return;

    const fetchTokenDetails = async () => {

      hasFetched.current = true;
      setIsLoading(true);

      try {
        const url = address
            ? `${ApiUrl}/coin/coin/${token}?address=${address}`
            : `${ApiUrl}/coin/coin/${token}`;

        const response = await axios.get(url);

        if (response.status === 200) {
          setData(response.data.data);
        }

      } catch (err) {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 400 || status === 404) {
            showPopup("Coin Not Found", "error");
          } else {
            showPopup("Something went wrong", "error");
          }
        } else {
          showPopup("Try Again Later!", "error");
        }
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenDetails();

  }, [token, hasFetched, ApiUrl, showPopup]);

  useEffect(() => {
    if (!socket) return;

    const handlePrice = (msg: PriceSocketMsg) => {
      if (msg.type !== "PriceData") return;

      const newPrice = msg.data.Price[0]?.priceUsd ?? 0;

      if (lastPriceRef.current !== null) {
        if (newPrice > lastPriceRef.current) setPriceDirection("up");
        else if (newPrice < lastPriceRef.current) setPriceDirection("down");
        else setPriceDirection("same");

        setPreviousPrice(lastPriceRef.current);
      }

      lastPriceRef.current = newPrice;
      setPriceData(msg.data.Price);
      console.log(msg.data.Price);
    };
    socket.on("PriceData", handlePrice);

    const handleGraph = (msg: GraphSocketMsg) => {
      if (msg.type !== "GraphData") return;
      setChartData(msg.data.candles);
    };

    socket.on("GraphData", handleGraph);

    return () => {
      socket.off("GraphData", handleGraph);
      socket.off("PriceData", handlePrice);
    };
  }, [socket]);

  useEffect(() => {
    if (!data?.id) return;

    const loadHolders = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(`${ApiUrl}/coin/holders/${data?.id}`, {
          params: {
            page: String(page),
            limit: rowsPerPage,
          },
        });

        const { data: holders, pagination } = response.data;

        setHolder(holders || []);
        setTotalPages(pagination?.totalPages || 1);
        setTotalHolders(pagination.total)
        setError(null);
      } catch (err) {
        setError(err as Error);
        setHolder([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHolders();
  }, [ApiUrl, page, rowsPerPage, data?.id]);

  useEffect(() => {
    if (!socket) return;

    const handleUserAmount = (msg: { type: string; data: { UserAmount: number } }) => {
      if (msg?.type === "UserAmount") {
        const newBalance = msg.data.UserAmount;
        setUserAmount(newBalance)
        console.log(newBalance);
      }
    };

    socket.on('UserAmount', handleUserAmount);

    return () => {
      socket.off('UserAmount', handleUserAmount);
    };
  }, [AuthToken, socket, PriceData, address]);

  const renderIconLink = (url: string | undefined, iconClass: string) => {
    if (!url) return null;
    return (
      <a href={url} target={'_blank'} rel="noopener noreferrer">
        <i className={iconClass}></i>
      </a>
    );
  };
  const imageUrl = data?.logo || `https://memesfun.mypinata.cloud/ipfs/bafkreicgshszjb37waaku4ll5azvlxrsk7wsodg6fkdn5yohquhbbvv4cu`;
  const TotalTransactions = useCallback((value: string) => {
    setTotalTxs(value);
  }, []);

  useEffect(() => {
    const loadPrice = async () => {
      try {
        const price = await fetchZigPrice();
        setZigPrice(price);

        const IsSevenAvailable = !!PriceData[0]?.Pool?.is_seven_percent;
        const MAX_TOKEN_LIMIT = IsSevenAvailable
            ? process.env.NEXT_PUBLIC_ALLOCATED_SUPPLY_7_PERCENT
            : process.env.NEXT_PUBLIC_ALLOCATED_SUPPLY;


        const CurrentUserValue = (UserAmount ?? 0);
        const TargetPriceZig = PriceData[0]?.TargetPriceZig;
        const zigCollected = parseFloat(PriceData[0]?.BondingStats?.reserve ?? "0")

        const priceZigRaw = PriceData[0]?.priceZig;
        const basePriceRaw = PriceData[0]?.BondingStats?.basePrice;
        const priceZig = Number(priceZigRaw);
        const basePrice = Number(basePriceRaw);
        const conditionalPrice = priceZig > 0 ? priceZig : basePrice;


        // MAX AMOUNT OF TOKEN ACCORDING TO CONDITION
        const max_token_value = Number(MAX_TOKEN_LIMIT) === 694200000 && priceZig === 0
            ? Number(MAX_TOKEN_LIMIT) * 0.5
            : Number(MAX_TOKEN_LIMIT);

        const usedAmount = IsSevenAvailable
            ? CurrentUserValue
            : Number(PriceData[0]?.BondingStats?.supply ?? 0);


        // AMOUNT OF TOKEN LEFT
        const TokenLeft =  max_token_value - usedAmount;

        // TOTAL ZIG LEFT
        const zigLeft = TokenLeft * conditionalPrice;


        const Curve = await CalculateBondingCurve({
          zigCollected: PriceData[0]?.marketCapZig,
          targetPrice: Number(TargetPriceZig)
        });

        console.log("max_token_value", max_token_value)
        console.log("conditionalPrice", conditionalPrice)
        console.log("usedAmount", usedAmount)
        console.log("TokenLeft", TokenLeft)
        console.log("zigLeft", zigLeft)
        console.log("----------------------------------------------------")


        // SetConstantAmount(targetPrice);
        SetbondingCurve(Math.round(Number(Curve?.toFixed(2))))
        setLeftZig(zigLeft.toFixed(6))
        setCollectedZig(parseFloat(zigCollected.toFixed(3)));

      } catch (err) {
        console.error("Error fetching ZIG price:", err);
      }
    };

    if (PriceData.length > 0) {
      loadPrice();
    }
  }, [PriceData, zigPrice]);


  const effectivePrice =
    PriceData[0]?.priceZig && PriceData[0]?.priceZig !== 0
      ? PriceData[0].priceZig
      : PriceData[0]?.BondingStats?.basePrice;

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

  if (!isLoading && !data) {
    notFound();
  }

  return (
    <>
      {isLoading && <Loader name={'Loading Coin...'} fixed={true} />}
      <Breadcrum title={data ? `${data?.name} (${data?.symbol})` : "Token Details"} />

      <section className="coin_detail_sec">
        <div className="container">
          <Coindetailfilter />
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-12 coin_det">
              <div className="coin_info border_box">
                <div className="coin_prof d-flex ">
                  <Image
                    loader={ipfsLoader}
                    src={imageUrl}
                    alt={data ? data?.name : "Loading..."}
                    width={60}
                    height={60}
                    className="rounded-full profile_img"
                    crossOrigin="anonymous"
                  />
                  <div className="cont mainName">
                    <h3>
                      {data ? (
                          <>
                            {data.name} <span className="text-muted">({data.symbol})</span>
                          </>
                      ) : (
                          "Loading..."
                      )}
                    </h3>
                    <h4 >
                      {data && (
                        <>
                          <span>Creator: </span>
                          {data?.user?.address && (
                            <Link className={"new_link"} href={`${paths.profile}/${data.user.address}`}>
                              {shortenAddress(data.user.address)}
                            </Link>
                          )}
                        </>
                      )}
                    </h4>
                    <p>
                      {data?.description
                        ? `${data?.description.slice(0, 100)}${data?.description.length > 100 ? '...' : ''}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="coin_social d-flex">
                  {data && (
                    <AddToWalletButton
                      tokenDenom={data?.token || ""}
                      tokenSymbol={data?.symbol || ""}
                    />
                  )}
                  <button
                    className="copyAddress  cursor-pointer bg-transparent border-none outline-none"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleCopyAddress(data?.token);
                    }}
                  > <span> {data?.token === copied ? <FaCheck /> : <FaRegCopy />}</span>
                  </button>
                  {isAuthenticated && AuthToken && ApiUrl && (
                    <div className="star_icon">
                      <WishlistButton
                        itemId={token}
                        token={AuthToken}
                        ApiUrl={ApiUrl}
                        isAdded={(data?.wishlists[0]?.id ?? 0) > 0}
                      />                      </div>
                  )}
                  {renderIconLink(data?.website, "fa-regular fa-globe")}
                  {renderIconLink(data?.telegram, "fa-brands fa-telegram")}
                  {renderIconLink(data?.twitter, "fa-brands fa-x-twitter")}

                </div>

                {data && screenWidth > 991 && (
                  <CoinTabs
                    about={data?.description}
                    address={address || ""}
                    tokenId={token}
                    allData={data}
                    chartData={chartData}
                    onReadyTxs={TotalTransactions}
                  />
                )}

              </div>

            </div>
            <div className="col-lg-4 col-lg-4 col-sm-12 coin_stat">
              <div className="border_box side_border_box">
                <div className="side_head d-flex align-items-center">
                  <Image
                    loader={ipfsLoader}
                    src={imageUrl}
                    alt={data?.name ? data.name : "Loading..."}
                    width={53}
                    height={53}
                    className="rounded-full profile_img"
                    crossOrigin="anonymous"
                  />
                  <div className="cont">
                    <strong>
                      {data ? (
                          <>
                            {data.name} <span className="text-muted">({data.symbol})</span>
                          </>
                      ) : (
                          "Loading..."
                      )}
                    </strong>
                    <span>Bonding Curve Progress: {bondingCurve}%</span>
                  </div>
                </div>
                <div className="mc_box d-flex align-items-center">
                  <span>
                    <i className="fa-regular fa-clock"></i>  {data?.created_at ? dayjs(data?.created_at).fromNow() : 'Just now'} | {TotalTxs} txs | {formatPrice(PriceData[0]?.marketVolume ?? 0)} 24h Vol.
                  </span>
                </div>
                <ProgressBar progress={bondingCurve} />
                <div className={"graduate_Para"}>
                  <p>Graduate this coin to OroSwap Dex at 451.44 Zig Market Cap. There is {collectedZig} Zig in the bonding curve.</p>
                </div>
                {/*<div className="coin_sell d-flex justify-content-between">*/}
                {/*  <span>{collectedZig} Zig collected</span>*/}
                {/*  <span>{ConstantAmount === 0 ? `Loading...` : `${leftZig} ZIG left`}</span>*/}
                {/*</div>*/}
                <div className="side_btns">
                  <button><span> Price USD</span>
                    <strong>
                      {formatPrice(PriceData[0]?.priceUsd ?? 0)}
                      {previousPrice !== null && priceDirection !== "same" && (
                        <span className={priceDirection === "down" ? "red" : "green"}>
                          <i className={`fa-solid ${priceDirection === "down" ? "fa-caret-down" : "fa-caret-up"}`}></i>
                          {formatPrice(previousPrice ?? 0)}
                        </span>
                      )}
                    </strong>
                  </button>
                  <button><span>Market Cap</span>
                    <strong>
                      {formatPrice(PriceData[0]?.marketCap ?? 0)}
                    </strong>
                  </button>
                  <button>
                    <span>Market Vol (24h)</span>
                    <strong>
                      {formatPrice(PriceData[0]?.marketVolume ?? 0)}
                    </strong>
                  </button>
                  <button>
                    <span>Liquidity</span>
                    <strong>
                      {formatPrice(PriceData[0]?.Liquidity ?? 0)}
                    </strong>
                  </button>
                </div>
                <div className="border_box">
                  {data && isWalletConnected && (
                    <BuySellTabs
                      zigLeft={leftZig}
                      isWalletConnected={isWalletConnected}
                      tokenData={data}
                      ApiUrl={ApiUrl}
                      AuthToken={AuthToken || ''}
                      tokenPrice={Number(effectivePrice)}
                      pool={PriceData[0]?.Pool}
                      PriceData={PriceData[0]}
                    />
                  )}
                  {!isWalletConnected && !address && (
                    <div className="connect_wal">
                      <button className="theme_btn" onClick={handleModelOpen}>
                        Connect Wallet
                      </button>
                    </div>
                  )}
                </div>
                <div className="coin_det">
                  {data && screenWidth < 991 && (
                    <CoinTabs
                      about={data?.description}
                      address={address || ""}
                      tokenId={token}
                      allData={data}
                      chartData={chartData}
                      onReadyTxs={TotalTransactions}
                    />
                  )}
                </div>
                <HolderBox
                  Loading={isLoading}
                  holders={Holder}
                  error={!!error}
                  safePage={page}
                  totalPages={totalPages}
                  totalHolders={totalHolders}
                  onPageChange={setpage}
                />

              </div>


              {/* {screenWidth < 991 && (
                  <HolderBox 
                    Loading={isLoading}
                    holders={Holder}
                    error={!!error}
                    safePage={page}
                    totalPages={totalPages}
                  />
                )} */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
