'use client'

import BannerSlider from "../sliders/banner_slider";
import LaunchNewCoinButton from "@/components/ui/buttons/LaunchNewCoinButton";
import Image from "next/image";

interface BannerProps {
    ApiUrl: string;
}

export default function Banner({ ApiUrl }: BannerProps) {
  return (
    <>
      {/* Banner Section with Background Image */}
      <section className="banner_sec"  style={{
        // background: "url('/assets/img/banneR_bg.png') no-repeat center center/contain",
      }}>
        <div className="banner_sec_new container "  style={{
        background: "url('/assets/img/banner.png') no-repeat center ",
      }}>
          <div className="row row1">
            <div className="col-md-4 ">
            <Image src="/assets/img/banner_rocket.png" alt="" width={424} height={400} />
            </div>
           <div className="col-md-8 ">
           <div className="banner_cont">
              {/* <h1>Lol <span>s</span>2 Lambos</h1> */}
              <Image src="/assets/img/banner_heading.png" className="heading_img" alt="" width={609} height={102} />
              <div className="banner_btn_div">
                <Image src="/assets/img/black_arrow.png" alt="" className="left_arrow" width={50} height={82} />
              <LaunchNewCoinButton />
              <Image src="/assets/img/black_arrow.png" alt="" className="right_arrow" width={50} height={82} />
              </div>

            </div>
           </div>
          </div>
        </div>

        {/* Slider Section Below the Banner */}
        <div className="container-fluid">
          <div className="row">
            <BannerSlider ApiUrl={ApiUrl} />
          </div>
        </div>
      </section>
    </>
  );
};
