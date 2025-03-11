'use client'

interface LaunchTokenModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LaunchTokenModal({isOpen, onClose}: LaunchTokenModalProps) {
    if(!isOpen) return null;
    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
            {/* Modal Container */}
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h5 className="modal-title">Launch Token</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body">
                        <p>Choose a wallet provider to connect:</p>
                        <button className="btn btn-primary w-100 my-2">Connect with MetaMask</button>
                        <button className="btn btn-secondary w-100">Connect with WalletConnect</button>
                    </div>
                </div>
            </div>
        </div>
    )
}