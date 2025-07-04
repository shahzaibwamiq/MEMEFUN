"use client";

import ProfileSlider from "@/components/proflielist/profileslider";
import {useState, useEffect, useCallback, useRef, JSX} from "react";
import { useSelector } from "react-redux";
import ThreadBox, { ThreadBoxProps } from "../boxs/ThreadBox";
import axios from "axios";
import { RootState } from "@/store/store";
import GraphTabs from "@/components/ui/Tabs/GraphTabs";
import ThreadBoxSkeleton from "../skeletons/threadBoxSkeleton";
import ReplyButton from "@/components/ui/buttons/PostReply";
import {CoinAttributes, TransactionAttributes} from "@/utils/Interfaces/CoinInterfaces";
import { shortenAddress } from "@/utils/AddressShortner";
import {CandleData} from "@/components/charts/tradingChart";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface coinsProps {
  about?: string
  address: string
  tokenId: string
  allData?: CoinAttributes
  chartData: CandleData[],
  onReadyTxs: (value: string) => void,
}

export default function CoinTabs({ about, address, tokenId, allData, chartData, onReadyTxs}:coinsProps): JSX.Element {
  
  useEffect(() => {
    const handleResize = () => {
      // Handle resize if needed in the future
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const ApiUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  //TODO: Update post id dynamically
  const postId = tokenId;

  const [page, setPage] = useState("1");
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState<TransactionAttributes[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [SimilarCoin, setSimilarCoin] = useState<CoinAttributes[]>([]);

  const threadPagination = useRef(1);
  const [threads, setThreads] = useState<ThreadBoxProps[] | null>(null);
  const [activeTab, setActiveTab] = useState("tab1");
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [threadError, setThreadError] = useState(false);

  const loadThreads = useCallback(async (page: number) => {
    if (isFetching || !hasMore || threadError) return;

    try {
      setIsFetching(true);
      const response = await axios.get(`${ApiUrl}/comment/allcomment/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: page,
          limit: 10,
          address: address
        }
      });

      if (response?.data.success) {
        const newThreads = response.data.data;

        // Check for existing threads to prevent duplicates
        setThreads(prev => {
          if (!prev) return newThreads;
          
          // Create a set of existing thread IDs for fast lookup
          const existingThreadIds = new Set(prev.map(thread => thread.id));
          
          // Filter out threads that already exist
          const uniqueNewThreads = newThreads.filter((thread: ThreadBoxProps) => !existingThreadIds.has(thread.id));
          
          // Only append if there are actually new threads
          if (uniqueNewThreads.length === 0) {
            setHasMore(false); // No new threads, so no more pages
            return prev;
          }
          
          return [...prev, ...uniqueNewThreads];
        });

        if (newThreads.length < 5) setHasMore(false); // no more pages
        else threadPagination.current += 1;
      }
      else {
        console.warn(response?.data.message || "Failed to load threads.");
        setThreadError(true);
        setHasMore(false);
        setThreads(null)
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (e: unknown) {
      setThreadError(true);
      setHasMore(false);
      setThreads(null)
    }
    finally {
      setIsFetching(false);
    }
  }, [ApiUrl, postId, token, isFetching, hasMore, threadError, address]);

  useEffect(() => {
    setThreads(null);
    threadPagination.current = 1;
    setHasMore(true);
    setThreadError(false);
  }, [tokenId]);

  useEffect(() => {
    if (threads === null && !isFetching && !threadError) {
      threadPagination.current = 1;
      setHasMore(true);
      loadThreads(1);
    }
  }, [threads, isFetching, threadError, loadThreads]);

  useEffect(() => {
    const wrapper = document.querySelector(".threads_wrapper");

    const handleScroll = () => {
      if (!wrapper) return;
      const { scrollTop, scrollHeight, clientHeight } = wrapper;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        loadThreads(threadPagination.current);
      }
    };

    wrapper?.addEventListener("scroll", handleScroll);
    return () => wrapper?.removeEventListener("scroll", handleScroll);
  }, [loadThreads]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const loadTransaction = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(`${ApiUrl}/coin/transaction/${allData?.id}`, {
          params: {
            page,
            limit: 10,
          },
        });

        const { data: transactions, pagination } = response.data;

        setData(transactions || []);
        setTotalPages(pagination?.totalPages || 1);
        setError(null);
        onReadyTxs(pagination?.total)
      } catch (err) {
        setError(err as Error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (allData?.id) {
      loadTransaction();
      interval = setInterval(() => {
        loadTransaction();
      }, 60000); // refresh every 10 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [ApiUrl, page, allData?.id, onReadyTxs]);

  const safePage = Number(page);

  const renderPageNumbers = () =>
      Array.from({ length: totalPages }, (_, i) => {
        const pageNum = i + 1;
        const isEdge = pageNum === 1 || pageNum === totalPages;
        const isNear = Math.abs(safePage - pageNum) <= 1;

        if (totalPages > 5 && !isEdge && !isNear) {
          if (pageNum === safePage - 2 || pageNum === safePage + 2) {
            return (
                <li key={`dots-${pageNum}`} className={'page-item'}>
                  <a className={"page-link"}>...</a>
                </li>
            );
          }
          return null;
        }

        return (
            <li key={pageNum} className={safePage === pageNum ? "active page-item" : "page-item"}>
              <a
                  href="#"
                  className={safePage === pageNum ? "active page-link" : "page-link"}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(String(pageNum));
                  }}
              >
                {pageNum}
              </a>
            </li>
        );
      });

  useEffect(() => {
    const loadTokens = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${ApiUrl}/coin/similar-coins/${allData?.token}`);

        const { data: tokens } = response.data;

        setSimilarCoin(tokens || []);
      } catch (err) {
        setError(err as Error);
        setSimilarCoin([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTokens();
  }, [ApiUrl, page, token, allData]);

  return (
    <div className="w-full max-w-md mx-auto prof_tabs">
      {/* Tabs Navigation */}
      <div className="flex border-b tabs_head">
        {["Overview", "About", 'Similar Coins'].map(
          (label, index) => {
            const tabKey = `tab${index + 1}`;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={` nav_btn ${activeTab === tabKey ? "active_tab" : "not_active"
                  }`}
              >
                {label}
              </button>
            );
          }
        )}
      </div>

      {/* Tabs Content */}
      <div className="prof_tab_Cont ">
        {activeTab === "tab1" && (
          <div className="cont">
            <GraphTabs chartData={chartData} symbol={allData?.symbol || "custom"}/>
          </div>
        )}
        {activeTab === "tab2" && (
          <div className="cont">
            <h5>About Coin</h5>
            <p>
              {about || "No About Found"}
            </p>
          </div>
        )}

        {activeTab === "tab3" && (
          <div className="cont">
            <div className="border_box similir_coin_box">
              <h3>Similar Coins</h3>
              <ProfileSlider
                  ApiUrl={ApiUrl}
                  isAuthenticated={isAuthenticated}
                  AuthToken= {token || undefined}
                  data={SimilarCoin}
                  error={error}
                  isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </div>
      <div className="seperate_Boxs">
        <div className="cont">
          <div className="coin_held">
            <div className="border_box transactions">
              <h5>Transactions</h5>
              <div className="table_box">
                <div className="table-responsive">
                  <table className="table table-dark table-hover text-center">
                    <thead>
                    <tr>
                      <th>Date/Time</th>
                      <th>Type</th>
                      <th>Qty</th>
                      <th>USD</th>
                      <th>ZIG</th>
                      <th>Address</th>
                      <th>Txs</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4 text-white">Loading transactions...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4 text-red-500">Error loading transactions.</td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4 text-gray-400">No transactions found</td>
                        </tr>
                    ) : (
                        data.map((tx, idx) => (
                            <tr key={idx}>
                              <td>{tx?.created_at ? dayjs(tx?.created_at).fromNow() : 'Just now'}</td>
                              <td className={tx.type ? "buy": "sell"}>{tx.type ? "Buy": "Sell"}</td>
                              <td>{parseFloat(tx.qty)}</td>
                              <td>${parseFloat(tx.amount).toFixed(6)}</td>
                              <td>{parseFloat(tx.zig).toFixed(6)} zig</td>
                              <td>{shortenAddress(tx.address)}</td>
                              <td>
                                <a href={`https://zigscan.org/tx/${tx.txid}`} target="_blank" rel="noopener noreferrer">
                                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                </a>
                              </td>
                            </tr>
                        ))
                    )}
                    </tbody>

                  </table>
                </div>

                {/* <!-- Pagination --> */}
                <nav className={'w-100'}>
                  <ul className="pagination justify-content-center">
                    {safePage > 1 && (
                        <li className={'page-item'}>
                          <a
                              href="#"
                              className="page-link"
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(String(safePage - 1));
                              }}
                          >
                            <i className="fa-solid fa-angles-left"></i>
                          </a>
                        </li>
                    )}
                    {renderPageNumbers()}
                    {safePage < totalPages && (
                        <li className={'page-item'}>
                          <a
                              href="#"
                              className="page-link"
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(String(safePage + 1));
                              }}
                          >
                            <i className="fa-solid fa-angles-right"></i>
                          </a>
                        </li>
                    )}
                  </ul>
                </nav>
              </div>
            </div>
           
          </div>
        </div>
        <div className="cont">
          <div className="border_box thread_box_main">
            <div className="threads_head">
              <h5>Threads</h5>
              <ReplyButton
                  tokenId={tokenId}
                  TotalThreads={threads?.length || 0}
                  onPostSuccess={() => {
                    setThreads(null);
                    setHasMore(true);
                    setThreadError(false);
                    threadPagination.current = 1;
                    loadThreads(1);
                  }}
              />
            </div>
            <div className="threads-content threads_wrapper">
              {threadError ? (
                  <p className="text-center text-red-500 w-full">No Threads Found</p>
              ) : threads ? (
                  threads.length > 0 ? (
                      <>
                        {threads.map((thread) => (
                            <ThreadBox key={`thread-${thread.id}`} {...thread} tokenId={tokenId} threadLenght={threads.length} />
                        ))}
                        {isFetching && <ThreadBoxSkeleton />}
                      </>
                  ) : (
                      <p className="text-center w-full">No Threads Found</p>
                  )
              ) : (
                  <ThreadBoxSkeleton />
              )}
            </div>
          </div>
        </div>
       
      </div>

    </div>
  );
}
