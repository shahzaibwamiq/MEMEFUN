'use client'


interface CoinFiltersProps {
    allTokens?: boolean;
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export default function CoinFilters({ allTokens = true, searchTerm, onSearchChange }: CoinFiltersProps) {
    return (
        <div className="filter_row">
            {/* Search Bar Container */}
            <div className="search-container d-flex gap-2">
                <div className="input-group">
                    {/* Search Icon */}
                    <span className="input-group-text bg-dark border-0 text-white">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                    {/* Search Input Field */}
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Token"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Filter Options Container */}
                {allTokens && (
                    <div className="filter_options">
                            {/* Filters Button */}
                            {/* <button className="btn btn-custom fltr_btn">
                            Show Animations
                            <div className=" style3">
            <div className="">
                <label className="switch" htmlFor="animationcheck">
                    <input
                        type="animationcheck"
                        id="animationcheck"
                    />
                    <div className="slider round"></div> 
                </label>
            </div>
        </div>
                        </button> */}
                        {/* Finalize Button */}
                        {/*<button className="btn btn-custom">*/}
                        {/*    <Image*/}
                        {/*        alt="finalize"*/}
                        {/*        src="/assets/img/final.svg"*/}
                        {/*        width={30}*/}
                        {/*        height={30}*/}
                        {/*    />*/}
                        {/*    Finalize*/}
                        {/*</button>*/}

                        {/* New Button */}
                        {/*<button className="btn btn-custom">*/}
                        {/*    <Image*/}
                        {/*        alt="finalize"*/}
                        {/*        src="/assets/img/new.svg"*/}
                        {/*        width={30}*/}
                        {/*        height={30}*/}
                        {/*    />*/}
                        {/*    New*/}
                        {/*</button>*/}

                        {/* Trending Button */}
                        {/*<button className="btn btn-custom">*/}
                        {/*    <Image*/}
                        {/*        alt="finalize"*/}
                        {/*        src="/assets/img/trending.svg"*/}
                        {/*        width={30}*/}
                        {/*        height={30}*/}
                        {/*    />*/}
                        {/*    Trending*/}
                        {/*</button>*/}

                    

                        {/* View Mode Toggle (Grid/List) */}
                         {/*  <div className="grid_btns">
                          Grid View Button */}
                            {/* <button className="icon-button active">
                                <Image
                                    width={19}
                                    height={19}
                                    alt=""
                                    src="/assets/img/grid.png"
                                />
                            </button> */}

                            {/* List View Button */}
                            {/* <button className="icon-button">
                                <Image
                                    width={25}
                                    height={20}
                                    alt=""
                                    src="/assets/img/bars.png"
                                />
                            </button> 
                        </div>*/}
                    </div>
                )}
            </div>
        </div>
    );
};
