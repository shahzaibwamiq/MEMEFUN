"use client";

import LaunchTokenModal from "@/components/ui/modals/LaunchTokenModal";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChain } from "@cosmos-kit/react";
import { usePopup } from "@/providers/PopupProvider";

interface ButtonProps {
  ButtonText?: string;
}

export default function LaunchNewCoinButton({ ButtonText }: ButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { address, openView } = useChain(`${process.env.NEXT_PUBLIC_CHAIN_NAME}`, true);
  const { showPopup } = usePopup();
  const router = useRouter();

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkMobile(); // Initial check
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Open wallet connect if modal is triggered without an address
  useEffect(() => {
    if (isOpen && !address) {
      openView();
      showPopup("Wallet connectivity required.", "error");
      setIsOpen(false);
    }
  }, [isOpen, address, openView, showPopup]);

  const handleClick = () => {
    if (isMobile) {
      router.push("/launch-token");
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <div className="banner_btn">
        <button onClick={handleClick}>
          {ButtonText ?? "Launch New Coin"}
        </button>
      </div>

      {/* Show modal only on desktop with a connected wallet */}
      {address && !isMobile && (
        <LaunchTokenModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
