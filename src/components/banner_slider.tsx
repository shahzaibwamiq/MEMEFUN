"use client";

import React, { useState, useEffect } from "react";

const slidesData = [
  {
    background: "./assets/img/red.png",
    img1: "./assets/img/bs1.png",
    address: "Ox8w...ae",
    status: "sold",
    price: "0.8 BNB of HotHot",
    icon: "./assets/img/smile_down.png",
  },
  {
    background: "./assets/img/red.png",
    img1: "./assets/img/bs1.png",
    address: "Ox8w...ae",
    status: "sold",
    price: "0.8 BNB of HotHot",
    icon: "./assets/img/smile_down.png",
  },
  {
    background: "./assets/img/red.png",
    img1: "./assets/img/bs1.png",
    address: "Ox8w...ae",
    status: "sold",
    price: "0.8 BNB of HotHot",
    icon: "./assets/img/smile_down.png",
  },
];

export default function BannerSlider() {
  const [current, setCurrent] = useState(0);
  const length = slidesData.length;

  // Optional auto-play: uncomment to enable auto sliding every 3 seconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, [length]);

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  return (
    <div className="banner-slider" style={{ position: "relative", overflow: "hidden" }}>
      <div
        className="slider_items"
        style={{
          display: "flex",
          transform: `translateX(-${current * 100}%)`,
          transition: "transform 0.5s ease-in-out",
          width: `${length * 100}%`,
        }}
      >
        {slidesData.map((slide, index) => (
          <div
            key={index}
            className="item slides"
            style={{
              background: `url('${slide.background}')`,
              backgroundSize: "cover",
              minWidth: "100%",
            }}
          >
            <div className="d-flex">
              <img src={slide.img1} alt="" className="img1" />
              <div className="cont">
                <div className="badge d-flex">
                  <strong>{slide.address}</strong>
                  <span className="sold">{slide.status}</span>
                </div>
                <p>{slide.price}</p>
              </div>
              <img src={slide.icon} alt="" />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
        }}
      >
        Prev
      </button>
      <button
        onClick={nextSlide}
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
        }}
      >
        Next
      </button>
    </div>
  );
}
