"use client";

import { useState, useEffect } from "react";
import ShareLinkButton from "../modals/shareLinkModal";
import { usePathname, useSearchParams } from "next/navigation";

export default function Coindetailfilter() {
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const fullPath = `${window.location.origin}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`;
      setCurrentPath(fullPath);
    }
  }, [pathname, searchParams]);

  return (
    <>
      <div className="detail_coin_filter row">
        {currentPath && <ShareLinkButton link={currentPath} />}
        {/*<div className="detail_coin_fltr col-md-4">*/}
        {/*  <div className="search-container ">*/}
        {/*    <button className="">*/}
        {/*      <i className="fa-solid fa-magnifying-glass"></i>*/}
        {/*    </button>*/}
        {/*    <input type="text" className="" placeholder="Search Token" />*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </>
  );
}
