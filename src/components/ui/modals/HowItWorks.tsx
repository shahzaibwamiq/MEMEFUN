"use client";

import Image from "next/image";
import { useEffect } from "react";
import LaunchNewCoinButton from "@/components/ui/buttons/LaunchNewCoinButton";

/**
 * HowItWorksModal Component
 * Displays a modal explaining how the platform works.
 */
interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
};

const HowItWorksModal = ({ isOpen, onClose }: HowItWorksModalProps) => {
  useEffect(() => {
    // Disable scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  // If modal is not open, do not render anything
  if (!isOpen) return null;

  return (
    <div
      className="isopen position-fixed works_modal launch_token_modal top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
      style={{ zIndex: 1050 }}
      // onClick={onClose}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-body">
            {/* Modal Title */}
            <h5 className="modal-title text-center">Launch Your Token: Step-by-Step Guide</h5>

            {/* Close Button */}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>

            {/* Introduction Text */}
            <p className="text-center">
            At memes.fun, we’ve turned token launching into a game with four simple steps. Ready to level up? Let’s go!
            </p>

            {/* Step-by-Step Instructions */}
            <div className="step_divs">
              {/* Step 1 */}
              <div className="row">
                <div className="img_div">
                  <Image
                    src={"/assets/img/step1.png"}
                    alt=""
                    width={150}
                    height={150}
                  />
                  <Image
                    src={"/assets/img/step1light.png"}
                    alt=""
                    className="light_step"
                    width={150}
                    height={150}
                  />
                </div>
                <div className="works_cont">
                  <button className="theme_btn">Step-1</button>
                  <h5>Find Top Trending Meme Coins</h5>
                  <p>
                  Start by exploring the top trending meme coins in our marketplace. Search through the most popular tokens and pick the one that aligns with your vision. Stay ahead of the curve and pick a winner!
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="row">
                <div className="works_cont">
                  <button className="theme_btn">Step-2</button>
                  <h5>Purchase Them via the Bonding Curve</h5>
                  <p>
                  Now that you&rsquo;ve found the perfect token, it’s time to buy! Use our Bonding Curve model for the best prices and a smooth, fair process. This method guarantees your tokens are priced just right based on demand, so you’re always in control of your game.
                  </p>
                </div>
                <div className="img_div">
                  <Image
                    src={"/assets/img/step2.png"}
                    alt=""
                    width={150}
                    height={150}
                  />
                  <Image
                    src={"/assets/img/step2light.png"}
                    className="light_step"
                    alt=""
                    width={150}
                    height={150}
                  />
                </div>
              </div>

              {/* Step 3 */}
              <div className="row">
                <div className="img_div">
                  <Image
                    src={"/assets/img/step3.png"}
                    alt=""
                    width={150}
                    height={150}
                  />
                  <Image
                    src={"/assets/img/step3light.png"}
                    alt=""
                    className="light_step"
                    width={150}
                    height={150}
                  />
                </div>
                <div className="works_cont">
                  <button className="theme_btn">Step-3</button>
                  <h5>Sell at Any Time to Lock in Your Profits</h5>
                  <p>
                  You&rsquo;re the hero of this game – sell your tokens whenever you choose to lock in those sweet profits! With memes.fun, you get to decide the best time to cash out and manage your winnings like a true champion.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="row">
                <div className="works_cont">
                  <button className="theme_btn">Step-4</button>
                  <h5>Liquidity to DEX</h5>
                  <p>
                  The final boss: adding liquidity to a decentralized exchange (DEX). This is where your token really gets its chance to shine. Once listed, your coin becomes available for others to trade, bringing your creation into the crypto spotlight!
                  </p>
                </div>
                <div className="img_div">
                  <Image
                    src={"/assets/img/step4.png"}
                    alt=""
                    width={150}
                    height={150}
                  />
                   <Image
                    src={"/assets/img/step4light.png"}
                    className="light_step"
                    alt=""
                    width={150}
                    height={150}
                  />
                </div>
              </div>
            </div>
<span>Once you’ve completed these four epic steps, you’re ready to launch your token and start trading! Join memes.fun today and dive into the action of meme-based cryptocurrencies. It’s time to make your token a success!</span>
            {/* Bottom Section */}
             <div className="banner_sec_new container "  style={{
                    background: "url('/assets/img/banner.png') no-repeat center center ",
                  }}>
                      <div className="row row1">
                        <div className="col-md-4 col-sm-12">
                        <Image src="/assets/img/banner_rocket.png" alt="" width={424} height={482} />
                        </div>
                       <div className="col-md-8 col-sm-12">
                       <div className="banner_cont">
                          {/* <h1>Lol <span>s</span>2 Lambos</h1> */}
                          <Image src="/assets/img/banner_heading.png" alt="" width={609} height={102} />
                          <div className="banner_btn_div">
                            <Image src="/assets/img/black_arrow.png" alt="" width={50} height={82} />
                          <LaunchNewCoinButton />
                          <Image src="/assets/img/black_arrow.png" alt="" width={50} height={82} />
                          </div>
            
                        </div>
                       </div>
                      </div>
                    </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksModal;
