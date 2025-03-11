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
import { width } from "@fortawesome/free-brands-svg-icons/fa42Group";

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
                      <Image
                        alt="finalize"
                        src="/assets/img/final.png"
                        width={30}
                        height={30}
                      />
                      Finalize
                    </button>
                    <button className="btn btn-custom">
                      <Image
                        alt="finalize"
                        src="/assets/img/new.png"
                        width={30}
                        height={30}
                      />
                      New
                    </button>
                    <button className="btn btn-custom">
                      <Image
                        alt="finalize"
                        src="/assets/img/trending.png"
                        width={30}
                        height={30}
                      />
                      Trending
                    </button>
                    <button className="btn btn-custom fltr_btn">
                      Filters
                      <Image
                        alt="finalize"
                        src="/assets/img/filter.png"
                        width={45}
                        height={24}
                      />
                    </button>

                    <div className="grid_btns">
                      <button className="icon-button active">
                        <Image
                          width={45}
                          height={24}
                          alt=""
                          src="/assets/img/grid.png"
                        />
                      </button>

                      <button className="icon-button">
                        <Image
                          width={45}
                          height={24}
                          alt=""
                          src="/assets/img/bars.png"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row prof_data">
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

                    <div
                      className="prof_prog"
                      style={{ width: "52%", height: "100%" }}
                    ></div>
                  </div>
                  <span className="rounded-full percent prof_per">52%</span>
                </div>

                <div className="star_icon ">
                  <FontAwesomeIcon icon={faStar} />
                </div>

                <h2 className="text-center ">Broccoli</h2>
                <p className="">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium
                </p>
                <div className="flex items-center justify-center amount">
                  <Image
                    alt=""
                    src="/assets/img/profile/leaf.png"
                    width={30}
                    height={30}
                  />
                  <span>13.63% BR</span> &nbsp; | &nbsp; <span>$6390</span>
                </div>

                {/* Transaction Info */}
                <div className=" text-center trans_info">
                  <FontAwesomeIcon icon={faClock} /> 2 mths &nbsp; | &nbsp; 203
                  txs &nbsp; | &nbsp; $958 2h vol
                </div>

                {/* Progress Bar */}
                <Profileprogressbar progress={36} />

                {/* Icons */}
                <div className="flex justify-center gap-5 mt-3 btm_icon">
                  <a href="javascript:;">
                    <i className="fa-solid fa-globe"></i>
                  </a>
                  <a href="javascript:;">
                    <i className="fa-brands fa-telegram"></i>
                  </a>
                  <a href="javascript:;">
                    <i className="fa-brands fa-x-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="profile_box">
                {/* Profile Image & Progress Badge */}
                <div className=" prof_box">
                  <div className="relative">
                    <Image
                      src="/assets/img/profile/2.png" // Change to actual path
                      alt="Profile"
                      width={60}
                      height={60}
                      className="rounded-full profile_img"
                    />

                    <div
                      className="prof_prog"
                      style={{ width: "52%", height: "100%" }}
                    ></div>
                  </div>
                  <span className="rounded-full percent prof_per">52%</span>
                </div>

                <div className="star_icon ">
                  <FontAwesomeIcon icon={faStar} />
                </div>

                <h2 className="text-center ">Broccoli</h2>
                <p className="">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium
                </p>
                <div className="flex items-center justify-center amount">
                  <Image
                    alt=""
                    src="/assets/img/profile/leaf.png"
                    width={30}
                    height={30}
                  />
                  <span>13.63% BR</span> &nbsp; | &nbsp; <span>$6390</span>
                </div>

                {/* Transaction Info */}
                <div className=" text-center trans_info">
                  <FontAwesomeIcon icon={faClock} /> 2 mths &nbsp; | &nbsp; 203
                  txs &nbsp; | &nbsp; $958 2h vol
                </div>

                {/* Progress Bar */}
                <Profileprogressbar progress={36} />

                {/* Icons */}
                <div className="flex justify-center gap-5 mt-3 btm_icon">
                  <a href="javascript:;">
                    <i className="fa-solid fa-globe"></i>
                  </a>
                  <a href="javascript:;">
                    <i className="fa-brands fa-telegram"></i>
                  </a>
                  <a href="javascript:;">
                    <i className="fa-brands fa-x-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="profile_box">
                {/* Profile Image & Progress Badge */}
                <div className=" prof_box">
                  <div className="relative">
                    <Image
                      src="/assets/img/profile/3.png" // Change to actual path
                      alt="Profile"
                      width={60}
                      height={60}
                      className="rounded-full profile_img"
                    />

                    <div
                      className="prof_prog"
                      style={{ width: "52%", height: "100%" }}
                    ></div>
                  </div>
                  <span className="rounded-full percent prof_per">52%</span>
                </div>

                <div className="star_icon ">
                  <FontAwesomeIcon icon={faStar} />
                </div>

                <h2 className="text-center ">Broccoli</h2>
                <p className="">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium
                </p>
                <div className="flex items-center justify-center amount">
                  <Image
                    alt=""
                    src="/assets/img/profile/leaf.png"
                    width={30}
                    height={30}
                  />
                  <span>13.63% BR</span> &nbsp; | &nbsp; <span>$6390</span>
                </div>

                {/* Transaction Info */}
                <div className=" text-center trans_info">
                  <FontAwesomeIcon icon={faClock} /> 2 mths &nbsp; | &nbsp; 203
                  txs &nbsp; | &nbsp; $958 2h vol
                </div>

                {/* Progress Bar */}
                <Profileprogressbar progress={36} />

                {/* Icons */}
                <div className="flex justify-center gap-5 mt-3 btm_icon">
                  <a href="javascript:;">
                    <i className="fa-solid fa-globe"></i>
                  </a>
                  <a href="javascript:;">
                    <i className="fa-brands fa-telegram"></i>
                  </a>
                  <a href="javascript:;">
                    <i className="fa-brands fa-x-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="profile_box">
                {/* Profile Image & Progress Badge */}
                <div className=" prof_box">
                  <div className="relative">
                    <Image
                      src="/assets/img/profile/4.png" // Change to actual path
                      alt="Profile"
                      width={60}
                      height={60}
                      className="rounded-full profile_img"
                    />

                    <div
                      className="prof_prog"
                      style={{ width: "52%", height: "100%" }}
                    ></div>
                  </div>
                  <span className="rounded-full percent prof_per">52%</span>
                </div>

                <div className="star_icon ">
                  <FontAwesomeIcon icon={faStar} />
                </div>

                <h2 className="text-center ">Broccoli</h2>
                <p className="">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium
                </p>
                <div className="flex items-center justify-center amount">
                  <Image
                    alt=""
                    src="/assets/img/profile/leaf.png"
                    width={30}
                    height={30}
                  />
                  <span>13.63% BR</span> &nbsp; | &nbsp; <span>$6390</span>
                </div>

                {/* Transaction Info */}
                <div className=" text-center trans_info">
                  <FontAwesomeIcon icon={faClock} /> 2 mths &nbsp; | &nbsp; 203
                  txs &nbsp; | &nbsp; $958 2h vol
                </div>

                {/* Progress Bar */}
                <Profileprogressbar progress={36} />

                {/* Icons */}
                <div className="flex justify-center gap-5 mt-3 btm_icon">
                  <a href="javascript:;">
                    <i className="fa-solid fa-globe"></i>
                  </a>
                  <a href="javascript:;">
                    <i className="fa-brands fa-telegram"></i>
                  </a>
                  <a href="javascript:;">
                    <i className="fa-brands fa-x-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="profile_box">
                {/* Profile Image & Progress Badge */}
                <div className=" prof_box">
                  <div className="relative">
                    <Image
                      src="/assets/img/profile/5.png" // Change to actual path
                      alt="Profile"
                      width={60}
                      height={60}
                      className="rounded-full profile_img"
                    />

                    <div
                      className="prof_prog"
                      style={{ width: "52%", height: "100%" }}
                    ></div>
                  </div>
                  <span className="rounded-full percent prof_per">52%</span>
                </div>

                <div className="star_icon ">
                  <FontAwesomeIcon icon={faStar} />
                </div>

                <h2 className="text-center ">Broccoli</h2>
                <p className="">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium
                </p>
                <div className="flex items-center justify-center amount">
                  <Image
                    alt=""
                    src="/assets/img/profile/leaf.png"
                    width={30}
                    height={30}
                  />
                  <span>13.63% BR</span> &nbsp; | &nbsp; <span>$6390</span>
                </div>

                {/* Transaction Info */}
                <div className=" text-center trans_info">
                  <FontAwesomeIcon icon={faClock} /> 2 mths &nbsp; | &nbsp; 203
                  txs &nbsp; | &nbsp; $958 2h vol
                </div>

                {/* Progress Bar */}
                <Profileprogressbar progress={36} />

                {/* Icons */}
                <div className="flex justify-center gap-5 mt-3 btm_icon">
                  <a href="javascript:;">
                    <i className="fa-solid fa-globe"></i>
                  </a>
                  <a href="javascript:;">
                    <i className="fa-brands fa-telegram"></i>
                  </a>
                  <a href="javascript:;">
                    <i className="fa-brands fa-x-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="profile_box">
                {/* Profile Image & Progress Badge */}
                <div className=" prof_box">
                  <div className="relative">
                    <Image
                      src="/assets/img/profile/6.png" // Change to actual path
                      alt="Profile"
                      width={60}
                      height={60}
                      className="rounded-full profile_img"
                    />

                    <div
                      className="prof_prog"
                      style={{ width: "52%", height: "100%" }}
                    ></div>
                  </div>
                  <span className="rounded-full percent prof_per">52%</span>
                </div>

                <div className="star_icon ">
                  <FontAwesomeIcon icon={faStar} />
                </div>

                <h2 className="text-center ">Broccoli</h2>
                <p className="">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium
                </p>
                <div className="flex items-center justify-center amount">
                  <Image
                    alt=""
                    src="/assets/img/profile/leaf.png"
                    width={30}
                    height={30}
                  />
                  <span>13.63% BR</span> &nbsp; | &nbsp; <span>$6390</span>
                </div>

                {/* Transaction Info */}
                <div className=" text-center trans_info">
                  <FontAwesomeIcon icon={faClock} /> 2 mths &nbsp; | &nbsp; 203
                  txs &nbsp; | &nbsp; $958 2h vol
                </div>

                {/* Progress Bar */}
                <Profileprogressbar progress={36} />

                {/* Icons */}
                <div className="flex justify-center gap-5 mt-3 btm_icon">
                  <a href="javascript:;">
                    <i className="fa-solid fa-globe"></i>
                  </a>
                  <a href="javascript:;">
                    <i className="fa-brands fa-telegram"></i>
                  </a>
                  <a href="javascript:;">
                    <i className="fa-brands fa-x-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="profile_box">
                {/* Profile Image & Progress Badge */}
                <div className=" prof_box">
                  <div className="relative">
                    <Image
                      src="/assets/img/profile/7.png" // Change to actual path
                      alt="Profile"
                      width={60}
                      height={60}
                      className="rounded-full profile_img"
                    />

                    <div
                      className="prof_prog"
                      style={{ width: "52%", height: "100%" }}
                    ></div>
                  </div>
                  <span className="rounded-full percent prof_per">52%</span>
                </div>

                <div className="star_icon ">
                  <FontAwesomeIcon icon={faStar} />
                </div>

                <h2 className="text-center ">Broccoli</h2>
                <p className="">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium
                </p>
                <div className="flex items-center justify-center amount">
                  <Image
                    alt=""
                    src="/assets/img/profile/leaf.png"
                    width={30}
                    height={30}
                  />
                  <span>13.63% BR</span> &nbsp; | &nbsp; <span>$6390</span>
                </div>

                {/* Transaction Info */}
                <div className=" text-center trans_info">
                  <FontAwesomeIcon icon={faClock} /> 2 mths &nbsp; | &nbsp; 203
                  txs &nbsp; | &nbsp; $958 2h vol
                </div>

                {/* Progress Bar */}
                <Profileprogressbar progress={36} />

                {/* Icons */}
                <div className="flex justify-center gap-5 mt-3 btm_icon">
                  <a href="javascript:;">
                    <i className="fa-solid fa-globe"></i>
                  </a>
                  <a href="javascript:;">
                    <i className="fa-brands fa-telegram"></i>
                  </a>
                  <a href="javascript:;">
                    <i className="fa-brands fa-x-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="row pagination_row ">
           <div className="col-12 pagi_col">
           <div className="perpage">
              <span>Tokens Per Page</span>
              <select name="perpage" id="perpage">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div className="pagination_btn">
                <ul className="d-flex list-unstyle">
                    <li><a className="back" href="#"><i className="fa-solid fa-angles-left"></i></a></li>
                    <li><a href="#" className="active">1</a></li>
                    <li><a href="#">2</a></li>
                    <li><a href="#">3</a></li>
                    <li><a href="#">..</a></li>
                    <li><a href="#">25</a></li>
                    <li><a className="next" href="#"><i className="fa-solid fa-angles-right"></i></a></li>
                </ul>
            </div>
            <div className="total_page_info">
                <p>1-30 of 1,190 </p>
            </div>
           </div>
          </div>
        </div>
      </section>
    </>
  );
}
