"use client";

import { useEffect, useRef } from "react";
import {
    createChart,
    IChartApi,
    Time,
    CandlestickData,
} from "lightweight-charts";

export interface Props {
    data: { time: number; open: number; high: number; low: number; close: number, volume: number }[];
    height?: number;
}

export default function MiniChart({ data, height = 70 }: Props) {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ReturnType<IChartApi["addCandlestickSeries"]> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const container = chartContainerRef.current;
        const containerWidth = container.clientWidth;

        if (chartRef.current) {
            chartRef.current.remove();
        }

        const chart = createChart(container, {
            width: containerWidth,
            height,
            layout: {
                background: { color: "transparent" },
                textColor: "#999",
            },
            grid: {
                vertLines: { visible: false },
                horzLines: { visible: false },
            },
            crosshair: {
                vertLine: { visible: false },
                horzLine: { visible: false },
            },
            timeScale: {
                visible: false,
            },
            rightPriceScale: {
                visible: false,
            },
        });

        const series = chart.addCandlestickSeries({
            upColor: "#00ff88",
            downColor: "#ff4d4d",
            borderVisible: false,
            wickUpColor: "#00ff88",
            wickDownColor: "#ff4d4d",
        });

        const formattedData: CandlestickData[] = data.map((d) => ({
            time: d.time as Time,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
        }));

        series.setData(formattedData);

        chartRef.current = chart;
        seriesRef.current = series;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const newWidth = entry.contentRect.width;
                chart.applyOptions({ width: newWidth });
            }
        });

        resizeObserver.observe(container);

        return () => {
            chart.remove();
            chartRef.current = null;
            seriesRef.current = null;
            resizeObserver.disconnect();
        };
    }, [data, height]);

    return <div ref={chartContainerRef} style={{ width: "80%", height, paddingRight: "10px" }} />;
}
