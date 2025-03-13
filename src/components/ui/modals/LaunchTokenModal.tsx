"use client";

import Image from "next/image";
// import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

interface LaunchTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LaunchTokenModal({
  isOpen,
  onClose,
}: LaunchTokenModalProps) {
  if (!isOpen) return null;
  //   const [buyerLimit, setBuyerLimit] = useState(false);
  return (
    <div
      className={`${
        isOpen ? "isopen" : ""
      } position-fixed launch_token_modal top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50`}
      style={{ zIndex: 1050 }}
    >
      {/* Modal Container */}
      <div className="modal-dialog">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <Image
              className="modal_logo"
              alt=""
              src="/assets/img/logo.png"
              width={395}
              height={154}
            />
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <h5 className="modal-title">Launch Token</h5>
            <div className="upload_img">
              <div className="label">
                <input type="file" />
                <Image
                  alt=""
                  src="/assets/img/upload.png"
                  width={142}
                  height={142}
                />
              </div>
              <span>Upload (png, jpeg. gif)</span>
            </div>
            <div className="fields_div">
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <input type="text" placeholder="Token Name" className="" />
                </div>
                <div className="col-md-6 col-sm-12">
                  <input
                    type="text"
                    placeholder="Token Symbol"
                    className="w-1/2 p-2 bg-gray-800 rounded text-white"
                  />
                </div>
                <div className="col-12">
                  <textarea
                    placeholder="Type Description"
                    className="w-full"
                  ></textarea>
                </div>
                {/* Social Links */}
                <div className="flex justify-between mt-4 social_icons">
                  <button className="">
                    <FontAwesomeIcon icon={faXTwitter} /> Twitter
                  </button>
                  <button className="">
                    <FontAwesomeIcon icon={faTelegram} /> Telegram
                  </button>
                  <button className="">
                    <FontAwesomeIcon icon={faGlobe} /> Website
                  </button>
                </div>

                <div className="col-12 token_meth">
                  <input
                    type="text"
                    placeholder="Type Link (Optional)"
                    className="type_link"
                  />

                  <h3 className="">Token Launch Methodology</h3>
                  <p className="">
                    <a href="#" className="text-green-400">
                      Classic Bonding Curve
                    </a>
                    using the formula 𝑥 × 𝑦 = 𝑘. It works in the best traditions
                    of AMM and meme launches. This option offers simplicity of
                    launches but with less leverage for sustainable growth.
                  </p>

                  {/* Token Sale Settings */}
                  <div className="mt-4">
                    <label className="block text-sm">Token Sale Settings</label>
                    <select className="w-full p-2 bg-gray-800 rounded text-white mt-1">
                      <option>Initial Buy</option>
                      <option>Presale</option>
                    </select>
                  </div>
                  {/* Advanced Settings - Toggle */}
                  <div className="advan_set">
                    <span>Advanced Settings</span>
                    <div className="cont">
                      <div className="adva_check">
                        <label className="switch" htmlFor="checkbox1">
                          <input type="checkbox" id="checkbox1" />
                          <div className="slider round"></div>
                        </label>
                      </div>
                      <div className="cont_right">
                      <strong>7% Single Buyer Limit</strong>
                      <span>Limit the maximum number of tokens a single buyer can purchase to 7% of the total supply. This setting ensures a fairer distribution of tokens. <a href="#">More info…</a></span>
                      </div>
                    </div>
                    <div className="dep_fee">
                        <p>Deploy service fee <span>0.0005 ZIG</span></p>
                      </div>
                      <div className="term_agre">
                      <input type="checkbox" id="checkbox" />
                      <span>I agree to the Meme.fun <a href="#">Terms of Use</a></span>
                      </div>
                  </div>
                  {/* Connect Wallet Button */}
                  <button className="w-full submit_btn">
                    Connect Wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
