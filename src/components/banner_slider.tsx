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

// To enable infinite looping we clone the last and first slide.
export default function BannerSlider() {
  const extendedSlides = [
    slidesData[slidesData.length - 1],
    ...slidesData,
    slidesData[0],
  ];

  // Start at index 1 (first "real" slide)
  const [current, setCurrent] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  // Each slide will take 1/3.5 of the container width (3 full + half slide)
  const slideWidthPercent = 100 / 3.5; // ~28.57%

  const nextSlide = () => {
    setCurrent((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrent((prev) => prev - 1);
  };

  // When reaching a cloned slide, disable transition and jump to the proper real slide
  useEffect(() => {
    if (current === extendedSlides.length - 1) {
      // Reached clone of first slide; jump to first real slide (index 1)
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrent(1);
      }, 500);
      setTimeout(() => {
        setTransitionEnabled(true);
      }, 510);
    }
    if (current === 0) {
      // Reached clone of last slide; jump to last real slide (index = extendedSlides.length - 2)
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrent(extendedSlides.length - 2);
      }, 500);
      setTimeout(() => {
        setTransitionEnabled(true);
      }, 510);
    }
  }, [current, extendedSlides.length]);

  return (
    <div
      className="banner-slider"
      style={{ position: "relative", overflow: "hidden", width: "100%" }}
    >
      <div
        className="slider_items"
        style={{
          display: "flex",
          transition: transitionEnabled ? "transform 0.5s ease-in-out" : "none",
          transform: `translateX(-${current * slideWidthPercent}%)`,
        }}
      >
        {extendedSlides.map((slide, index) => (
          <div
            key={index}
            className="item slides"
            style={{
              flex: `0 0 calc(100% / 3.5)`,
              background: `url('${slide.background}')`,
              backgroundSize: "cover",
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
