"use client"; // For Next.js App Router

import TradingChart from "@/components/charts/tradingChart";
import { CandleData } from "@/components/charts/tradingChart";

export interface GraphSocketMsg {
  type: string;
  data:  { candles: CandleData[]; new?: boolean };
}
interface graphTabs {
  chartData: CandleData[];
  symbol: string;
}
export default function GraphTabs({ chartData, symbol }: graphTabs) {



  return (
    <div className="w-full max-w-md mx-auto graph_tabs">
      {/* Tabs Content */}
      <div className="prof_tab_Cont ">
        <div className="cont">
          <TradingChart data={chartData} symbol={symbol} />
        </div>
      </div>
    </div>
  );
}