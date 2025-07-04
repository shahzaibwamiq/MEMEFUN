'use client'

import Image from "next/image";
import Link from "next/link";
import { paths } from "@/paths";
import { useState } from "react";
import HowItWorksModal from "@/components/ui/modals/HowItWorks";

export default function Footer() {
    // State to manage the visibility of the "How It Works" modal
    const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

    return (
        <>
            {/* Footer Section */}
            <footer className="footer" style={{ 
                background: "url('/assets/img/ft_back.png')" 
                // background: "url('/assets/img/cube.png')" 
                }}>


{/* <div className="animation_footer">
  <div className="cube">
    <div className="sides">
      <div className="top"></div>
      <div className="right"></div>
      <div className="bottom"></div>
      <div className="left"></div>
      <div className="front"></div>
      <div className="back"></div>
    </div>
  </div>
</div> */}
            
                <div className="container">
                    <div className="row">

                        {/* Left Column: Logo & Short Description */}
                        <div className="col-md-4 col-sm-12 ft1">
                            <Image alt="" width={196} height={109} src='/assets/img/footer_logo.png' className="dark_logo" />
                            <Image alt="" width={196} height={109} src='/assets/img/light_logo.png' className="light_logo" />
                            <p>Where Memes Meet the Future of Crypto </p>
                        </div>

                        {/* Middle Column: Navigation Links */}
                        <div className="col-md-4 col-sm-12 ft2">
                            <h3 className="widget_title">Useful Links</h3>
                            <ul className="ft_nav">
                                <li><Link href={paths.tokens}>My Tokens</Link></li>
                                <li><Link href={paths.rewards}>Rewards</Link></li>
                                <li className="nav-item">
                                    <Link
                                        className="nav-link active"
                                        aria-current="page"
                                            href='how-it-works'
                                      >
                                         How It Works
                                      </Link>
                                </li>
                                <li><Link href={paths.advanced}>Advanced</Link></li>
                                <li><Link href={paths.faq}>FAQ&apos;s</Link></li>
                                <li><Link href={paths.fees}>Fees</Link></li>
                            </ul>
                        </div>

                        {/* Right Column: Subscription & Social Media */}
                        <div className="col-md-4 col-sm-12 ft3">
                            <h3 className="widget_title">Connect With Us</h3>
                            <div className="btm_icon ft_icon">
                                <a href="https://x.com/MemesDotFun_" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                                    <i className="fa-brands fa-x-twitter"></i>
                                </a>
                                <a href="https://t.me/MemesFun_Official " aria-label="Telegram" target="_blank" rel="noopener noreferrer">
                                    <i className="fa-brands fa-telegram"></i>
                                </a>
                            </div>
                        </div>

                        {/* Bottom Section: Disclaimer & Copyright */}
                        <div className="col-lg-12 col-md-12 col-sm-12 ft4">
                            <p>
                            Digital assets, especially meme coins, are highly speculative and carry a significant risk of loss. Trading them may result in losing your entire investment. memes.fun does not guarantee the success, value, or profitability of any meme coin created or traded on the platform. All tokens, images, descriptions, and related content are user-generated. memes.fun is not responsible for the accuracy, legitimacy, or outcomes related to this content. The responsibility lies entirely with the creator of the token. We do not endorse, vet, or verify any user-uploaded media or project claims. We strongly encourage all users to DYOR (Do Your Own Research), understand their financial limits, and assess their risk tolerance before engaging with any crypto assets on our platform.memes.fun is your comfort zone, gaming zone, and financial playground. It&apos;s a place to launch, trade, and have fun, but always play smart and stay safe. Let the games begin, responsibly.

                            </p>

                            {/* Copyright & Terms Links */}
                            <div className="site_info">
                                <span>© memes.fun 2025</span>
                                <div className="terms_link">
                                    <ul>
                                         <li><Link href={'https://mdf.gitbook.io/mdf'} target="_blank">Git Book</Link></li>
                                        <li>|</li>
                                        <li><Link href={paths.privacy}>Privacy Policy</Link></li>
                                        <li>|</li>
                                        <li><Link href={paths.terms}>Terms of Service</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* "How It Works" Modal Component */}
            <HowItWorksModal
                isOpen={isHowItWorksOpen}
                onClose={() => setIsHowItWorksOpen(false)}
            />
        </>
    );
};