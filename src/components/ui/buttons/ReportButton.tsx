"use client";

import { useState } from "react";
import Image from "next/image";

export default function Reportbutton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex justify-center items-center h-screen">
        {/* Open Modal Button */}
        <button
          onClick={() => setIsOpen(true)}
        >
          Report
        </button>
  
        {/* Modal */}
        {isOpen && (
           <div
                className="position-fixed report_modal top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
                style={{ zIndex: 1050 }}
                role="dialog"
                aria-modal="true"
                // onClick={handleBackgroundClick}
              >
                <div className="modal-dialog modal-dialog-centered p-4" style={{ background: "url('/assets/img/connect_modal.png')", maxWidth: "500px" }}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Report</h5>
                      <button type="button" className="btn-close" aria-label="Close" onClick={() => setIsOpen(false)}>X</button>
                    </div>
          
                    <div className="modal-body">
                      <p className="text-center">Select the reporting reason</p>
          
                      <div className="prof_det text-center">
                        <Image alt="User profile" src="/assets/img/prof_img.png" width={142} height={142} />
                        <div className="user_id">
                          User: <span className="fw-bold">sdewAViJ1Hu2MoJW37F3ktt5cMHNN6b3Ug71rYnbaswr</span>
                        </div>
                      </div>
          
                      <div className="report_form mt-3">
                        <label htmlFor="report_reason" className="form-label">Reason</label>
                        <select className="form-select mb-3" name="report_reason" id="report_reason">
                          <option value="">Select a reason</option>
                          <option value="1">Spam</option>
                          <option value="2">Abusive Content</option>
                          <option value="3">Other</option>
                        </select>
          
                        <label htmlFor="report_desc" className="form-label">Description</label>
                        <textarea
                          className="form-control mb-3"
                          name="report_desc"
                          id="report_desc"
                          rows={3}
                          placeholder="Describe the issue..."
                        ></textarea>
          
                        <button className="theme_btn w-100">Send Report</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
        )}
      </div>
    );
  }