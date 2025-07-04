"use client";

import Breadcrum from "@/components/ui/breadcrum/Breadcrum";
// import Image from "next/image";

export default function Rewards() {
  return (
    <>
      {/* Breadcrumb navigation */}
      <Breadcrum title="Rewards" />

      <section className="reward_sec">
        <div className="container">

          {/* Rewards Banner Section */}
          {/* <div className="banner_row row">
            <div className="col-md-8 col-sm-12">
              <h2>Complete Tasks & Claim Your Rewards</h2>
              <p>
                Collect smilies that you can spend on amazing prizes and
                airdrops.
              </p>

              <div className="btn_div d-flex">
                <button className="theme_btn_banner theme_btn">Launch New Coin</button>
                <button className="wallet_btn">
                  <Image
                    src="/assets/img/wallet.png"
                    alt="Wallet Icon"
                    width={48}
                    height={48}
                    className="img-fluid"
                  />
                  <span>Connect Wallet</span>
                </button>
              </div>
            </div>

            <div className="col-md-4 col-sm-12">
              <Image
                alt=""
                src="/assets/img/reward_banner_right.png"
                width={354}
                height={411}
              />
            </div>
          </div> */}

          {/* Invite Friends Section */}
          <div className="row invite_friend_row ">
            <div className="col-12">
            <div  className="invite_friend coming_soon d-flex justify-content-center">
               
                    <h3>Coming Soon...</h3>
                    
                </div>
              {/* Invite friend cards (Repeated multiple times) */}
              {/* {[...Array(4)].map((_, index) => (
                <div key={index} className="invite_friend d-flex justify-content-between">
                  <div className="invite_head">
                    <h3>Invite a friend</h3>
                    <p>
                      Invite a friend and earn 10% of their MFC, plus 10% of the
                      fees from their trades as ZIG.
                    </p>
                  </div>
                  <div className="invite d-flex">
                    <strong>+100</strong>
                    
                    <button className="theme_btn">Invite</button>
                  </div>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </section>

    </>
  );
};
