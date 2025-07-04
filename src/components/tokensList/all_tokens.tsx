"use client";

import { useState, SetStateAction, lazy, Suspense, useEffect } from "react";
import { useSocket } from "@/providers/SocketProvider";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {CoinAttributes} from "@/utils/Interfaces/CoinInterfaces";
import axios from "axios";

const CoinFilters = lazy(() => import("@/components/ui/Filters/coin-filters"));
const CoinBoxs = lazy(() => import("@/components/ui/boxs/CoinBoxs"));

interface CoinSocketMsg {
    type: string;
    data: CoinAttributes | { coin: CoinAttributes; new?: boolean };
}

export default function AllTokens() {
    const { socket } = useSocket();
    const ApiUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;
    const AuthToken:string | null = useSelector((state: RootState) => state.auth.token);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const optionsOfRows = ["9", "18", "27"];
    const [rowsPerPage, setRowsPerPage] = useState(optionsOfRows[0]);
    const [page, setPage] = useState("1");
    const [data, setData] = useState<CoinAttributes[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // const currentPage = Number(page);
    const currentRows = Number(rowsPerPage);

    useEffect(() => {
        if (!socket) return;

        const handleCoin = (msg: CoinSocketMsg) => {
            if (msg.type !== "coins") return;

            const token = "coin" in msg.data ? msg.data.coin : msg.data;
            if (!token?.name || !token?.symbol || !token?.token) return;

            setData(prev => {
                const tokenBase = token.token.trim().toLowerCase();
                const filtered = prev.filter(t => t.token?.trim().toLowerCase() !== tokenBase);
                return [token as unknown as CoinAttributes, ...filtered];
            });
        };

        socket.on("coins", handleCoin);

        return () => {
            socket.off("coins", handleCoin);
        };
    }, [socket]);

    useEffect(() => {
        const loadTokens = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${ApiUrl}/coin/coins`, {
                    params: {
                        page,
                        limit: rowsPerPage,
                        search: searchTerm
                    }
                });

                const { data: tokens, pagination } = response.data;

                setData(tokens || []);
                setTotal(pagination?.total || 0);
                setTotalPages(pagination?.totalPages || 1);
                setError(null);
            } catch (err) {
                setError(err as Error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadTokens();
    }, [ApiUrl, page, rowsPerPage, searchTerm]);


    useEffect(() => {
        setPage("1");
    }, [searchTerm]);

    const safePage = Number(page);
    const paginatedData = data;


    const handleRowsPerPage = (e: { target: { value: SetStateAction<string> } }) => {
        setRowsPerPage(e.target.value);
        setPage("1");
    };

    const renderPageNumbers = () =>
        Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            const isEdge = pageNum === 1 || pageNum === totalPages;
            const isNear = Math.abs(safePage - pageNum) <= 1;

            if (totalPages > 5 && !isEdge && !isNear) {
                if (pageNum === safePage - 2 || pageNum === safePage + 2) {
                    return <li key={`dots-${pageNum}`}><a>...</a></li>;
                }
                return null;
            }

            return (
                <li key={pageNum}>
                    <a
                        href="#"
                        className={safePage === pageNum ? "active" : ""}
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


    return (
        <section className="profile_sec">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <Suspense fallback={<div>Loading Filters...</div>}>
                            <CoinFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                        </Suspense>
                    </div>
                </div>
            </div>

            <div className="container">
                <Suspense fallback={<div>Loading Tokens...</div>}>
                    <CoinBoxs
                        data={paginatedData}
                        ApiUrl={ApiUrl}
                        isAuthenticated={isAuthenticated}
                        AuthToken= {AuthToken || undefined}
                        error={error}
                        isLoading={isLoading}
                    />
                </Suspense>

                <div className="row pagination_row">
                    <div className="col-12 pagi_col">
                        <div className="perpage">
                            <span>Tokens Per Page</span>
                            <select value={rowsPerPage} onChange={handleRowsPerPage}>
                                {optionsOfRows.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pagination_btn">
                            <ul className="d-flex list-unstyle">
                                {safePage > 1 && (
                                    <li>
                                        <a href="#" className="back" onClick={(e) => {
                                            e.preventDefault();
                                            setPage(String(safePage - 1));
                                        }}>
                                            <i className="fa-solid fa-angles-left"></i>
                                        </a>
                                    </li>
                                )}
                                {renderPageNumbers()}
                                {safePage < totalPages && (
                                    <li>
                                        <a href="#" className="next" onClick={(e) => {
                                            e.preventDefault();
                                            setPage(String(safePage + 1));
                                        }}>
                                            <i className="fa-solid fa-angles-right"></i>
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>

                        <div className="total_page_info">
                            {total ? (
                                <p>{`${(safePage - 1) * currentRows + 1} - ${Math.min(safePage * currentRows, total)} of ${total}`}</p>
                            ) : (
                                <p>0-0 of 0</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
