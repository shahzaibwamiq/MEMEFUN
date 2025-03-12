'use client'

import Image from "next/image";

export default function CoinFilters(){
    return (
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
    )
}