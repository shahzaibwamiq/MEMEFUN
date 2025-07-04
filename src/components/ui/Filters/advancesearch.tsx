
import Image from "next/image";

export default function Advancesearch() {
  return (
    <>
      <div className="adv_search d-flex align-item-center justify-content-end">
        <div className="quick_buy">
          <span className="title">Quick Buy</span>
          <button className="quck_btn">
            <Image
              src={"/assets/img/st_flter.png"}
              alt=""
              width={27}
              height={27}
            />
            <span>0.01</span>
          </button>
        </div>
        <div className="set_btn">
          <button>
            <Image
              src={"/assets/img/setting.png"}
              alt=""
              width={28}
              height={28}
            />{" "}
          </button>
        </div>
        <div className="searc_tok">
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
        </div>
      </div>
    </>
  );
}
