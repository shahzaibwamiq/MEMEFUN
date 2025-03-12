'use client'

import Image from "next/image";

interface WalletConnect {
    isOpen: boolean;
    onClose: () => void;
}


export default function WalletModal({isOpen, onClose} :WalletConnect) {
    if (!isOpen) return null;

    return (
        <div className="position-fixed connect_wallet top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
            {/* Modal Container */}
            <div className="modal-dialog modal-dialog-centered" style={{background:"url('/assets/img/connect_modal.png')"}}>
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h5 className="modal-title">Select Wallet</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body">
                        <p>Sed ut pers is piciatis unde omnis iste natus error sit volu ptatem accusanti.</p>
                        <ul>
                        <li><button className="btn_wallet">
                            <Image alt="" src="/assets/img/leap.png" width={58} height={58} />
                            Leap Wallet
                            </button>
                            </li>
                        <li>
                            <button className="btn_wallet">
                            <Image alt="" src="/assets/img/cosmostation.png" width={58} height={58} />
                            Cosmostation Wallet
                            </button>
                            </li>
                        <li>
                            <button className="btn_wallet">
                            <Image alt="" src="/assets/img/math.png" width={58} height={58} />
                            Math Wallet
                            </button>
                            </li>
                        <li>
                            <button className="btn_wallet">
                            <Image alt="" src="/assets/img/keplr.png" width={58} height={58} />
                            Keplr Wallet
                            </button>
                            </li>
                        <li>
                            <button className="btn_wallet">
                            <Image alt="" src="/assets/img/atomic.png" width={58} height={58} />
                            Atomic Wallet
                            </button>
                            </li>
                        <li>
                            <button className="btn_wallet">
                        <Image alt="" src="/assets/img/gem.png" width={58} height={58} />  
                        Gem Wallet  
                            </button>
                            </li>
                        </ul
                        >
                    </div>
                </div>
            </div>
        </div>
    )
}