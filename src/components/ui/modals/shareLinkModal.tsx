"use client";

import { useState } from "react";

type ShareLinkButtonProps = {
    link: string;
};

export default function ShareLinkButton({ link }: ShareLinkButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(link).then(() => {
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false); // Reset the copied state after 2 seconds
            }, 2000);
        });
    };

    return (
        <div className="col-md-12 flex justify-center items-center h-screen">
            {/* Open Modal Button */}
            <div className="share_btn justify-content-end d-flex">
                <button
                    onClick={() => setIsOpen(true)}>
                    <i className="fa-solid fa-share-nodes"></i> Share
                </button>
            </div>

            {/* Modal */}
            {isOpen && (
                <div
                    className="position-fixed Share_modal report_modal top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
                    style={{ zIndex: 1050 }}
                    role="dialog"
                    aria-modal="true"

                >

                    <div className="modal-dialog modal-dialog-centered p-4" style={{
                        // background: "url('/assets/img/connect_modal.png')", 
                        maxWidth: "500px"
                    }}
                    >
                        {/* <DropAnimation/> */}
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Share Link</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setIsOpen(false)}>
                                    {/* <i className="fa-solid fa-xmark"></i> */}
                                </button>
                            </div>

                            <div className="modal-body">

                                <div className="report_form mt-3">
                                    <div>{link}</div>
                                    <button
                                        className="btn btn-primary mt-3"
                                        onClick={copyToClipboard}
                                    >
                                        {isCopied ? (
                                            <span>
                                                <i className="fa-solid fa-check"></i> 
                                            </span>
                                        ) : (
                                            <span>
                                                <i className="fa-solid fa-copy"></i> 
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}