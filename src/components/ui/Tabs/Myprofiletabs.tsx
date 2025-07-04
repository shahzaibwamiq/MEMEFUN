"use client"; // For Next.js App Router

import { useState } from "react";
import Image from "next/image";
import { ipfsLoader } from "@/utils/ipfsLoaders/ipfsLoader";

export interface Coin {
  id: string;
  token: string;
  name: string;
  logo: string;
  symbol: string;
}

interface ProfileData {
  AboutData?: string;
  coinCreated: Coin[];
}

export default function Myprofiletabs({ AboutData, coinCreated }: ProfileData) {
  const [activeTab, setActiveTab] = useState("tab1");
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tabs Navigation */}
      <div className="flex border-b tabs_head">
        {["About Me", "Coins Held", "Coins Created"].map(
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
            {AboutData ? (
              <div
                className="prose text-white"
                dangerouslySetInnerHTML={{ __html: AboutData }}
              />
            ) : (
              <p>No Description Found!</p>
            )}
          </div>
        )}
        {activeTab === "tab2" && (
          <div className="cont">
            {/* <div className="coin_held">
              <ul>
                <li>
                  <div className="lst_cont">
                    <div className="cont d-flex align-items-center">
                      <Image
                          loader={ipfsLoader}
                        alt=""
                        src={imageUrl}
                        width={47}
                        height={47}
                      />
                      <div className="det">
                        <strong className="d-block">Zig balance</strong>
                        <span className="d-block">0 ZIG</span>
                      </div>
                    </div>
                    <span className="amount">$0.00</span>
                  </div>
                </li>
                <li>
                  <div className="lst_cont">
                    <div className="cont d-flex align-items-center">
                      <Image
                        alt=""
                        src={"/assets/img/ethereum.png"}
                        width={47}
                        height={47}
                      />
                      <div className="det">
                        <strong className="d-block">Ethereum balance</strong>
                        <span className="d-block">0 ZIG</span>
                      </div>
                    </div>
                    <span className="amount">$0.00</span>
                  </div>
                </li>
                <li>
                  <div className="lst_cont">
                    <div className="cont d-flex align-items-center">
                      <Image
                        alt=""
                        src={"/assets/img/xrp.png"}
                        width={47}
                        height={47}
                      />
                      <div className="det">
                        <strong className="d-block">XRP balance</strong>
                        <span className="d-block">0 ZIG</span>
                      </div>
                    </div>
                    <span className="amount">$0.00</span>
                  </div>
                </li>
                <li>
                  <div className="lst_cont">
                    <div className="cont d-flex align-items-center">
                      <Image
                        alt=""
                        src={"/assets/img/bnb.png"}
                        width={47}
                        height={47}
                      />
                      <div className="det">
                        <strong className="d-block">BNB balance</strong>
                        <span className="d-block">0 ZIG</span>
                      </div>
                    </div>
                    <span className="amount">$0.00</span>
                  </div>
                </li>
                <li>
                  <div className="lst_cont">
                    <div className="cont d-flex align-items-center">
                      <Image
                        alt=""
                        src={"/assets/img/doge.png"}
                        width={47}
                        height={47}
                      />
                      <div className="det">
                        <strong className="d-block">Dogecoin balance</strong>
                        <span className="d-block">0 ZIG</span>
                      </div>
                    </div>
                    <span className="amount">$0.00</span>
                  </div>
                </li>
              </ul>
           
            </div> */}
          </div>
        )}
        {activeTab === "tab3" && <div className="cont">
          <div className="coin_held">
            <ul>
              {coinCreated.map((coin: Coin) => (
                <li key={coin.id}>
                  <div className="lst_cont">
                    <div className="cont d-flex align-items-center">
                      <Image
                        loader={ipfsLoader}
                        alt=""
                        src={coin.logo}
                        width={47}
                        height={47}
                      />
                      <div className="det">
                        <strong className="d-block">{coin.name}</strong>
                        <span className="d-block">({coin.symbol})</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>}
      </div>
    </div>
  );
}
