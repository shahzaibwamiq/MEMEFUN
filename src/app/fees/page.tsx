"use client";

import Breadcrum from "@/components/ui/breadcrum/Breadcrum";
export default function Fees() {
  return (
    <>
      {/* Breadcrumb navigation to indicate the current page */}
      <Breadcrum title="Fees" />

      <section className="fees_sec">
        <div className="container">
          <div className="row border_back">
            <div className="col-12">
              {/* Page Title */}
              <h2>Fees</h2>

              {/* Description of fees */}
              <p>
              At memes.fun we strive to provide transparent and fair pricing for all users. Below are the fees associated with using the platform:
              </p>

              <div className="fees_chart">
                {/* Table displaying different types of fees */}
                <table>
                  <thead>
                    <tr >
                      <th style={{ width: "45%" }}>Action</th>
                      <th>Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Create a coin</td>
                      <td>111 ZIG<br/> This fee is charged when you create a new token on the platform. </td>
                    </tr>
                    <tr>
                      <td>Buy or Sell a Coin on the Bonding Curve</td>
                      <td>1.234% of the total purchase or sale price for each trade.<br/>This fee is applicable when you buy or sell a coin using the bonding curve method.</td>
                    </tr>
                    <tr>
                      <td>When a Coin Graduates from the memes.fun Platform to Liquidity</td>
                      <td>111 Zig<br/>This fee applies when a token is moved from the memes.fun platform to liquidity pools.</td>
                    </tr>
                  </tbody>
                </table>

                {/* Additional fee-related notes */}
<div className="additional_notes">
<h2>*Additional Notes</h2>
                <b>*Network and Liquidity Fees:</b>
                <p>The 111 Zig is a fixed network fee that covers the cost of network operations and liquidity management, which might change from time to time. This fee is automatically deducted from the coin’s liquidity and does not require the user to pay it as an additional charge.</p>
                <b>*Additional Fees:</b>
                <p>Please note that if you access memes.fun through any other interface (e.g., through a third-party platform or app), additional fees may apply, which are not charged by memes.fun itself.<br/>These fees help maintain the platform’s operations and ensure a seamless and secure token launch experience. Should you have any questions regarding the fees or the fee structure, feel free to contact our support team.</p>
</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};
