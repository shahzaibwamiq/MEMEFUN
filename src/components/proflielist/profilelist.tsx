"use client";

import CoinFilters from "@/components/ui/Filters/coin-filters";

export default function Profilelist() {
  return (
    <>
      <section className="profile_sec">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {/* Filters Section */}
              <CoinFilters
                searchTerm="dummy"
                onSearchChange={() => { }}
              />
            </div>
          </div>
        </div>

        <div className="container">
          {/* Pagination Section */}
          <div className="row pagination_row ">
            <div className="col-12 pagi_col">
              {/* Tokens Per Page Dropdown */}
              <div className="perpage">
                <span>Tokens Per Page</span>
                <select name="perpage" id="perpage">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>

              {/* Pagination Controls */}
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

              {/* Total Page Info */}
              <div className="total_page_info">
                <p>1-30 of 1,190 </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
