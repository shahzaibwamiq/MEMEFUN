"use client";
import { useState } from "react";
import Image from "next/image";

export default function Filtermodal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-center items-center h-screen">
      {/* Open Modal Button */}
      <button onClick={() => setIsOpen(true)}>
        <span> Filters</span>

        <Image src={"/assets/img/filter.png"} alt="" width={19} height={10} />
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="position-fixed filter_modal report_modal top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
          role="dialog"
          aria-modal="true"
        // onClick={handleBackgroundClick}
        >
          <div
            className="modal-dialog modal-dialog-centered p-4"
            style={{
              // background: "url('/assets/img/connect_modal.png')",
              maxWidth: "500px",
            }}
          >
            {/* <DropAnimation /> */}
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Filter</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="modal-body">
                <p className="text-center">edit &quot;newly created&quot; column</p>
                <div className="w-100">
                  {/* <!-- Market Cap Section --> */}
                  <label className="form-label">Market Cap *</label>
                  <div className="d-flex align-items-center mb-3">
                    <div className="field_cs">
                      <input
                        type="text"
                        placeholder="From"
                        className="custom-input me-2"
                      />
                      <span className="text-white">$</span>
                    </div>
                    <span className="mx-2">to</span>
                    <div className="field_cs">
                      <input
                        type="text"
                        placeholder="To"
                        className="custom-input me-2"
                      />
                      <span className="text-white">$</span>
                    </div>
                  </div>

                  {/* <!-- Volume Section --> */}
                  <label className="form-label">Volume</label>
                  <div className="d-flex align-items-center mb-3">
                    <div className="field_cs">
                      <input
                        type="text"
                        placeholder="From"
                        className="custom-input me-2"
                      />
                      <span className="text-white">$</span>
                    </div>

                    <span className="mx-2">to</span>
                    <div className="field_cs">
                      <input
                        type="text"
                        placeholder="To"
                        className="custom-input me-2"
                      />
                      <span className="text-white">$</span>
                    </div>
                  </div>

                  {/* <!-- Last Section (Box) --> */}
                  <div className="">
                    <div className="d-flex align-items-center mb-3">
                      <div className="field_cs">
                        <input
                          type="text"
                          placeholder="From"
                          className="custom-input me-2"
                        />
                        <span className="text-white">$</span>
                      </div>

                      <span className="mx-2">to</span>
                      <div className="field_cs">
                        <input
                          type="text"
                          placeholder="To"
                          className="custom-input me-2"
                        />
                        <span className="text-white">$</span>
                      </div>
                    </div>

                    {/* <!-- Buttons --> */}
                    <button className="theme_btn w-100">Apply</button>
                    <a href="#" className="clear-link">
                      Clear
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
