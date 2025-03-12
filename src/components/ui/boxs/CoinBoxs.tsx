'use client'

import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faStar} from "@fortawesome/free-solid-svg-icons";
import Profileprogressbar from "@/components/ui/progressbar/Profileprogressbar";

export default function CoinBoxs(){
    return (
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
    )
};