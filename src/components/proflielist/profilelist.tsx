"use client";


import CoinFilters from "@/components/ui/Filters/coin-filters";
import CoinBoxs from "@/components/ui/boxs/CoinBoxs";

export default function Profilelist() {

  return (
    <>
      <section className="profile_sec">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
                <CoinFilters />
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <CoinBoxs />
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
