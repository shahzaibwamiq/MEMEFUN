"use client";
import Image from "next/image";

import Profileprogressbar from "@/components/ui/progressbar/Profileprogressbar";
import Filtermodal from "../ui/modals/Filtermodal";

interface FiltermodalProps {
    inputValue : string;
}
export default function Featured({inputValue}:FiltermodalProps) {
  return (
    <>
      <div className="adv_lst">
        <div className="adv_head">
          <h4>Featured</h4>
          <Filtermodal />
        </div>
         <div className="advanc_box">
          <div className="box_head d-flex">
            <h4>
              Viranta - AI Traning Platform (VIRANTA){" "}
              <span>
                
              </span>
            </h4>
            <div className="btn_sear d-flex">
              <button>
                <i className="fa-regular fa-copy"></i>
              </button>
              <button>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
              <button className="fvt">
                <i className="fa-regular fa-star"></i>
              </button>
            </div>
          </div>
          <div className="adv_prof" >
                <div className="info_box d-flex">
    <Image src={"/assets/img/ad3.png"} alt="" width={66} height={56} />
    <ul className="info_ls">
        <li><span>MC:</span>$4.8K</li>
        <li><span>VOL:</span>$731</li>
        <li><span>T10:</span> 4%</li>
        <li><span className="icon_ls"><i className="fa-regular fa-user"></i></span>10</li>
        <li><span className="icon_ls"><i className="fa-light fa-crosshairs"></i></span>2</li>
        <li><span className="icon_ls">DH</span>3%</li>
    </ul>
</div>
                <div className="chart_box d-flex">
        <Image src={'/assets/img/graph.png'} alt="" height={40} width={97} />
        <div className="st_box">
            <span>{inputValue}</span>
            <Image src={'/assets/img/zig.png'} alt="" height={25} width={25} />
        </div>
    </div>
                <div className="prog_box">
    <span className="frst">0%</span>
      {/* Progress Bar */}
      <Profileprogressbar progress={36} />
      <span className="lst">100%</span>
</div>
          </div>
        </div>
      </div>
    </>
  );
}
