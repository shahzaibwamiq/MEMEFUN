import BannerSlider from "../sliders/banner_slider";
import LaunchNewCoinButton from "@/components/ui/buttons/LaunchNewCoinButton";

export default function Banner() {
  return (
    <>
      <section className="banner_sec" style={{
    background: "url('/assets/img/banner_back.png') no-repeat center center/cover",
  }}
  >
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <div className="r1">
                <h1>LOL<span>s</span></h1>
                <img src="./assets/img/smile.png" alt="" />
              </div>
              <div className="r2 d-flex">
                <h1>2LAMBO</h1>
                <img src="./assets/img/right_smile.png" alt="" />
                <span>s</span>
              </div>
              <p>Spot the Next Big Crypto Trend Before It Blows Up!</p>
              <div className="ban_btn_img d-flex">

              <LaunchNewCoinButton/>

              <img src="./assets/img/arrow.png" alt="" />
              </div>
            </div>
            <div className="col-lg-6">
              <img src="./assets/img/banner_img.png" alt="" />
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
           <BannerSlider />
          </div>
        </div>
      </section>
    </>
  );
}
