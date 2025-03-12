'use client'

import BannerSlider from "../sliders/banner_slider";
import LaunchNewCoinButton from "@/components/ui/buttons/LaunchNewCoinButton";
import Image from "next/image";

export default function Banner() {
  return (
    <>
      <section className="banner_sec" style={{
    background: "url('/assets/img/banner_back.png') no-repeat center center/cover",
  }}
  >
        <div className="container bannser_sec_first">
          <div className="row">
            <div className="col-lg-6">
              <div className="r1">
                <h1>LOL<span>s</span></h1>
                <Image src="/assets/img/smile.png" alt="" width={87} height={87} />
              </div>
              <div className="r2 d-flex">
                <h1>2LAMBO</h1>
                <Image src="/assets/img/right_smile.png" alt="" width={103} height={103} />
                <span>s</span>
              </div>
              <p>Spot the Next Big Crypto Trend Before It Blows Up!</p>
              <div className="ban_btn_img d-flex align-items-center">
                <LaunchNewCoinButton/>
                <Image src="/assets/img/arrow.png" alt="" width={99} height={60} />
              </div>
            </div>
            <div className="col-lg-6">
              <Image src="/assets/img/banner_img.png" alt="" width={590} height={544} className={'banner_image'}/>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
           <BannerSlider />
          </div>
        </div>
      </section>
    </>
  );
}
