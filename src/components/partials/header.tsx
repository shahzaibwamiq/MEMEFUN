"use client";

import Link from "next/link";
import { useState } from "react";
import DarkModeButton from "@/components/ui/buttons/DarkModeButton";
import NotificationBellButton from "@/components/ui/buttons/NotificationBellButton";
import WalletConnect from "@/components/ui/buttons/WalletConnecterButton";
import ProfileButton from "@/components/ui/buttons/ProfileButton";
import Image from "next/image";
import HowItWorksModal from "@/components/ui/modals/HowItWorks";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { paths } from "@/paths";

export default function Header() {
  // State to manage the visibility of the "How It Works" modal
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Retrieve authentication status from Redux store
  const isAuthenticated: boolean = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <>
      {/* Header Section */}
      <link rel="icon" href="assets/img/favicon.png"  type="image/x-icon"/>
      <link rel="shortcut icon" href="assets/img/favicon.png" type="image/x-icon" />
      <link rel="apple-touch-icon" href="assets/img/favicon.png" type="image/x-icon" />
      <header className="head_main">
        <nav className="navbar navbar-expand-lg ">
          <div className="container">
            {/* Logo */}
            <Link className="navbar-brand" href="/" >
              <Image alt={''} src="/assets/img/logo.png" width={138} height={76} className={'dark_logo'}   />
              <Image alt={''} src="/assets/img/light_logo.png" width={138} height={76} className={'light_logo'}   />
            </Link>

            {/* Navbar Toggle Button for Mobile */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"

              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Navigation Links */}
            <div
              className={`navbar-sidebar ${menuOpen ? "active" : ""}`}
              id="navbarSupportedContent">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"

                onClick={() => setMenuOpen(!menuOpen)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              {/* Logo */}
              <Link className="navbar-brand d-none d-sm-block d-lg-none" href="/"  onClick={() => setMenuOpen(!menuOpen)}>
                <Image alt={''} src="/assets/img/logo.png" width={138} height={76} className={'dark_logo logo'}   />
              <Image alt={''} src="/assets/img/light_logo.png" width={138} height={76} className={'light_logo logo'}   />
              </Link>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" href={paths.tokens}  onClick={() => setMenuOpen(!menuOpen)}>
                    My Tokens
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    href={paths.rewards}
                     onClick={() => setMenuOpen(!menuOpen)}
                  >
                    Rewards
                  </Link>
                </li>
                <li className="nav-item">
                  {/* "How It Works" Link - Opens Modal */}
                  {/* <a
                    className="nav-link active cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default navigation behavior
                      setIsHowItWorksOpen(true);
                    }}
                  >
                    How It Works
                  </a> */}
        
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    href='how-it-works'
                     onClick={() => setMenuOpen(!menuOpen)}
                  >
                    How It Works
                  </Link>
                </li>
                <li className="nav-item ">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    href={paths.advanced}
                     onClick={() => setMenuOpen(!menuOpen)}
                  >
                    Advanced
                  </Link>
                </li>
                <li className="nav-item ">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    href={paths.faq}
                     onClick={() => setMenuOpen(!menuOpen)}
                  >
                    FAQ&apos;s
                  </Link>
                </li>
              </ul>
            </div>

            {/* Header Right Section - User Actions */}
            <div className="header_side d-flex">
              {/* Show Profile Button if Authenticated, Otherwise Show Wallet Connect Button */}
              {isAuthenticated ? <ProfileButton /> : <WalletConnect />}

              {/* Dark Mode Toggle Button */}
              <DarkModeButton />

              {/* Notification Bell */}
              {isAuthenticated ? <NotificationBellButton/>: ""}

            </div>
          </div>
        </nav>
        <div className="bug_btn"> 
<a href="/bug-report"><i className="fa-regular fa-spider"></i></a>
        </div>
      </header>

      {/* "How It Works" Modal Component */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </>
  );
};
