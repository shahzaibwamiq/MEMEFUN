"use client";

import Breadcrum from "@/components/ui/breadcrum/Breadcrum";

export default function Fees() {
  return (
    <>
      <Breadcrum title="Fees" />
      <section className="fees_sec">
        <div className="container">
          <div className="row border_back">
            <div className="col-12">
              <h2>Fees</h2>
              <p>
                The following are fees charged by the pump.fun platform when you
                use the meme.fun platform:
              </p>
              <div className="fees_chart">
                <table>
                  <tr >
                    <th style={{ width: "45%" }}>Action</th>
                    <th>Fee</th>
                  </tr>
                  <tr>
                    <td>Create a coin</td>
                    <td>0 ZIG</td>
                  </tr>
                  <tr>
                    <td>Buy or sell a coin while on the bonding curve</td>
                    <td>1% of the total purchase or sale price for each trade (in ZIG)</td>
                  </tr>
                  <tr>
                    <td>When a coin graduates from the pump.fun platform to Raydium*</td>
                    <td>6 ZIG</td>
                  </tr>
                </table>
                <p>*This is a fixed fee of 6 SOL that includes network and Raydium fees even though these may vary from time to time. This 6 SOL is taken from the liquidity of the coin and does not require the user to pay this as an additional amount.
<br /><br />
Note that none of the pump.fun frontend services (the pump.fun web app, pump.fun/advanced, and the pump.fun mobile app) charge any fees in addition to those above. If you access the pump.fun platform or smart contracts via another interface or platform, you may incur additional fees charged by those interfaces or platforms.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
