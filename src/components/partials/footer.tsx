'use client'
import Image from "next/image";

export default function Footer() {
    return (
      <>
          <footer className="footer" style={{
    background: "url('/assets/img/ft_back.png') no-repeat center center",
  }}
  >  
      <div className="container">
        <div className="row">
            <div className="col-md-4 col-sm-12 ft1">
                <Image alt="" width={306} height={119} src='/assets/img/footer_logo.png' />
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium </p>
            </div>
            <div className="col-md-4 col-sm-12 ft2">
                <h3 className="widget_title">
                Useful Links
                </h3>
                <ul className="ft_nav">
                    <li><a href="my-tokens">My Tokens</a></li>
                    <li><a href="rewards">Rewards</a></li>
                    <li><a href="#">How It Work</a></li>
                    <li><a href="#">Advanced</a></li>
                    <li><a href="documentation">Documentation</a></li>
                    <li><a href="fees">Fees</a></li>
                </ul>
            </div>
            <div className="col-md-4 col-sm-12 ft3">
            <h3 className="widget_title">
            Subscribe for Notification
                </h3>
                <div className="ft_btn">
                    <button>
                        <Image alt="" src="/assets/img/tele.png" width={38} height={47} />
                        Telegram Bot
                    </button>
                </div>
                <div className="btm_icon ft_icon">
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
            <div className="col-lg-12 col-md-12 col-sm-12 ft4">
                <p>Disclaimer: meme.fun will never endorse or encourage that you invest in any of the projects listed and therefore, accept no liability for any loss occasioned. It is the user(s) responsibility to do their own research and seek financial advice from a professional. More information about (DYOR) can be found via Zig Chain.</p>
            <div className="site_info">
                <span>© 2025 Memes.fun. All rights reserved</span>
                <div className="terms_link">
                    <ul>
                        <li><a href="privacy-policy">Privacy Policy</a></li>
                        <li>|</li>
                        <li><a href="terms-of-services">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            </div>
        </div>
      </div>
      </footer>
      </>
    );
}