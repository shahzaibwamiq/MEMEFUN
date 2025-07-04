"use client";

import { useEffect, useRef } from "react";
import {
    LibrarySymbolInfo,
    ResolutionString,
    HistoryCallback,
    Bar,
    DatafeedErrorCallback,
    PeriodParams,
    SearchSymbolsCallback,
    SymbolType,
} from "@public/charting_library/charting_library";

export interface CandleData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

interface TradingChartProps {
    symbol: string;
    data: CandleData[];
}

interface TradingViewWidget {
    remove: () => void;
}

interface TradingView {
    widget: (options: TradingViewWidgetOptions) => TradingViewWidget;
}

interface TradingViewWidgetOptions {
    autosize?: boolean;
    symbol: string;
    interval: ResolutionString;
    container: HTMLDivElement;
    library_path: string;
    locale?: string;
    theme?: "dark" | "light";
    timezone?: string;
    datafeed: IDatafeed;
}

interface IDatafeed {
    onReady: (cb: (config: { supported_resolutions: ResolutionString[] }) => void) => void;
    searchSymbols: (
        userInput: string,
        exchange: string,
        symbolType: SymbolType,
        onResult: SearchSymbolsCallback
    ) => void;
    resolveSymbol: (
        symbolName: string,
        onSymbolResolvedCallback: (symbolInfo: LibrarySymbolInfo) => void
    ) => void;
    getBars: (
        symbolInfo: LibrarySymbolInfo,
        resolution: ResolutionString,
        periodParams: PeriodParams,
        onHistoryCallback: HistoryCallback,
        onErrorCallback: DatafeedErrorCallback
    ) => void;
    subscribeBars: () => void;
    unsubscribeBars: () => void;
}

declare global {
    interface Window {
        TradingView: TradingView;
    }
}

const TradingChart = ({ data, symbol }: TradingChartProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetRef = useRef<TradingViewWidget | null>(null);
    const dataChartRef = useRef<CandleData[]>([]);
    const historyCallbackRef = useRef<HistoryCallback | null>(null);
    const lastPushedTimeRef = useRef<number>(0);
    const realTimeCallbackRef = useRef<((bar: Bar) => void) | null>(null);

    useEffect(() => {
        dataChartRef.current = data;

        const latest = dataChartRef.current[dataChartRef.current.length - 1];
        if (
            realTimeCallbackRef.current &&
            latest &&
            latest.time > lastPushedTimeRef.current
        ) {
            const bar: Bar = {
                time: parseInt(latest.time.toString()) * 1000,
                open: latest.open,
                high: latest.high,
                low: latest.low,
                close: latest.close,
                volume: latest.volume ?? 1,
            };

            realTimeCallbackRef.current(bar);
            lastPushedTimeRef.current = latest.time;
        }
    }, [data]);



    useEffect(() => {
        if (!containerRef.current || widgetRef.current) return;

        const script = document.createElement("script");
        script.src = "/charting_library/charting_library.js";
        script.onload = () => {
            if (!window.TradingView) {
                console.error("TradingView not available after script load.");
                return;
            }
            widgetRef.current = new window.TradingView.widget({
                autosize: true,
                symbol: symbol.toUpperCase(),
                interval: "1" as ResolutionString,
                container: containerRef.current!,
                library_path: "/charting_library/",
                locale: "en",
                theme: "dark",
                timezone: "Etc/UTC",
                overrides: {
                    "mainSeriesProperties.style": 1, // Candle
                    "mainSeriesProperties.candleStyle.upColor": "#089981",
                    "mainSeriesProperties.candleStyle.downColor": "#f23645",
                    "mainSeriesProperties.candleStyle.borderUpColor": "#089981",
                    "mainSeriesProperties.candleStyle.borderDownColor": "#f23645",
                    "mainSeriesProperties.candleStyle.wickUpColor": "#089981",
                    "mainSeriesProperties.candleStyle.wickDownColor": "#f23645",

                    "mainSeriesProperties.showPriceLine": true,
                    "mainSeriesProperties.priceLineVisible": true,
                    "mainSeriesProperties.showLastValue": true,
                    "mainSeriesProperties.priceLineWidth": 1,
                    "mainSeriesProperties.priceLineColor": "#ffffff",

                    "mainSeriesProperties.showTooltip": true, // tooltip on hover
                    "paneProperties.legendProperties.showLegend": true, // OHLC box on top left

                    "paneProperties.vertGridProperties.color": "#2A2E39",
                    "paneProperties.horzGridProperties.color": "#2A2E39",

                    "scalesProperties.lineColor": "#ffffff",
                    "scalesProperties.textColor": "#ffffff"
                },
                studies_overrides: {
                    "volume.volume.color.0": "#f23645", // down
                    "volume.volume.color.1": "#089981", // up
                    "volume.volume.transparency": 70,
                    "volume.volume ma.color": "#ffffff",
                },
                enabled_features: [
                    "right_bar_stays_on_scroll",
                    "display_market_status",
                ],
                disabled_features: [
                    "header_symbol_search",
                    "header_compare",
                    "header_indicators",
                    "add_to_watchlist",
                ],
                datafeed: {
                    onReady: (cb) => {
                        cb({
                            supported_resolutions: ["1", "5", "15", "30", "1h", "4h", "6h", "12h", "24h"] as ResolutionString[],
                        });
                    },
                    searchSymbols: (userInput, exchange, symbolType, onResult) => {
                        onResult([
                            {
                                symbol: symbol.toUpperCase(),
                                description: symbol.toUpperCase(),
                                exchange: "Zig",
                                type: symbolType,
                            },
                        ]);
                    },
                    resolveSymbol: (_, onResolve) => {
                        onResolve({
                            name: symbol.toUpperCase(),
                            ticker: symbol.toUpperCase(),
                            description: symbol.toUpperCase(),
                            type: "crypto",
                            session: "24x7",
                            timezone: "Etc/UTC",
                            minmov: 1,
                            pricescale: 1000000000,
                            has_intraday: true,
                            supported_resolutions: ["1", "5", "15", "30", "1h", "4h", "6h", "12h", "24h"] as ResolutionString[],
                            volume_precision: 2,
                            data_status: "streaming",
                            exchange: "Zig",
                            listed_exchange: "Zig",
                            format: "price",
                        });
                    },
                    getBars: (_symbolInfo, _resolution, { from, to }, onResult, onError) => {
                        try {
                            const bars: Bar[] = dataChartRef.current
                                .filter((d) => d.time >= from && d.time <= to)
                                .map((c) => ({
                                    time: parseInt(c.time.toString()) * 1000,
                                    open: c.open,
                                    high: c.high,
                                    low: c.low,
                                    close: c.close,
                                    volume: c.volume ?? 1,
                                }));
                            historyCallbackRef.current = onResult;
                            onResult(bars, { noData: bars.length === 0 });
                        } catch {
                            onError("Failed to load data");
                        }
                    },
                    subscribeBars: (_symbolInfo, _resolution, onRealtimeCallback) => {
                        realTimeCallbackRef.current = onRealtimeCallback;
                    },
                    unsubscribeBars: () => {
                        realTimeCallbackRef.current = null;
                    }
                },
            });
        };

        document.body.appendChild(script);

        return () => {
            widgetRef.current?.remove();
            widgetRef.current = null;
        };
    }, []);


    return (
        <div
            ref={containerRef}
            style={{
                height: "500px",
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                border: "2px solid #707070",
                backgroundColor: "#000",
            }}
        />
    );
};

export default TradingChart;
