"use client";

import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faTimes,
  faStar,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import Profileprogressbar from "../ui/progressbar/Profileprogressbar";

export default function profilelist() {
    const [progress, setProgress] = useState(36); // Default progress is 36%

  return (
    <>
      <section className="profile_sec">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="filter_row">
                <div className="search-container d-flex gap-2">
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-0 text-white">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search Token"
                    />
                  </div>

                  <div className="filter_options">
                    <button className="btn btn-custom">
                      <img
                        alt="finalize"
                        src="./assets/img/final.png"
                        width={30}
                        height={30}
                      />
                      Finalize
                    </button>
                    <button className="btn btn-custom">
                      <img
                        alt="finalize"
                        src="./assets/img/new.png"
                        width={30}
                        height={30}
                      />
                      New
                    </button>
                    <button className="btn btn-custom">
                      <img
                        alt="finalize"
                        src="./assets/img/trending.png"
                        width={30}
                        height={30}
                      />
                      Trending
                    </button>
                    <button className="btn btn-custom fltr_btn">
                      Filters
                      <img
                        alt="finalize"
                        src="./assets/img/filter.png"
                        width={45}
                        height={24}
                      />
                    </button>

                    <div className="grid_btns">
                      <button className="icon-button active">
                        <img src="./assets/img/grid.png" />
                      </button>

                      <button className="icon-button">
                        <img src="./assets/img/bars.png" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-4">
              <div className="profile_box">
                {/* Profile Image & Progress Badge */}
                <div className=" prof_box">
                  <div className="relative">
                    <Image
                      src="/assets/img/profile/1.png" // Change to actual path
                      alt="Profile"
                      width={60}
                      height={60}
                      className="rounded-full profile_img"
                    />
                    
                    <span className="rounded-full percent">
                      52%
                    </span>
                  </div>
                </div>

                {/* Star Icon */}
                <div className="star_icon ">
                  <FontAwesomeIcon icon={faStar} />
                </div>

                {/* Title & Description */}
                <h2 className="text-center ">Broccoli</h2>
                <p className="">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium
                </p>

                {/* Price & BR Token */}
                <div className="flex items-center justify-center amount">
                    <Image alt="" src='/assets/img/profile/leaf.png' width={30} height={30} />
                    <span>13.63% BR</span> &nbsp; | &nbsp; <span>$6390</span>
                </div>

                {/* Transaction Info */}
                <div className=" text-center trans_info">
                  <FontAwesomeIcon icon={faClock} /> 2 mths &nbsp; | &nbsp; 203
                  txs &nbsp; | &nbsp; $958 2h vol
                </div>

                {/* Progress Bar */}
                <Profileprogressbar progress={98} />

                {/* Icons */}
                <div className="flex justify-center gap-5 mt-3">
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className="text-gray-400 text-lg cursor-pointer hover:text-white"
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="text-gray-400 text-lg cursor-pointer hover:text-red-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
