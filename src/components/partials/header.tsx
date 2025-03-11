"use client";
import Link from "next/link";
import DarkModeButton from "@/components/ui/buttons/DarkModeButton";
import NotificationBellButton from "@/components/ui/buttons/NotificationBellButton";
import WalletConnect from "@/components/ui/buttons/WalletConnecterButton";
import Image from "next/image";


export default function Header() {
  return (
    <>
      <header className="head_main">
          <nav className="navbar navbar-expand-lg ">
            <div className="container-fluid">
              <Link className="navbar-brand" href="/">
                <Image alt={''} src="/assets/img/logo.png" width={304} height={119} className={'Logo'}/>
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" href="/my-tokens">
                      My Tokens
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      href="/rewards"
                    >
                      Rewards
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      href="/how-it-work"
                    >
                      How It Work
                    </Link>
                  </li>
                  <li className="nav-item ">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      href="/advanced"
                    >
                      Advanced
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="header_side d-flex">

                <WalletConnect />
                <DarkModeButton />
                <NotificationBellButton />

              </div>
            </div>
          </nav>
      </header>

    </>
  );
}
