"use client";

import React, { useState, useEffect, useRef } from "react";

const slidesData = [
  {
    background: "./assets/img/red.png",
    img1: "./assets/img/bs1.png",
    address: "Ox8w...ae",
    status: "sold",
    price: "0.8 BNB of HotHot",
    icon: "./assets/img/smile_down.png",
    className: "sold-slide",
  },
  {
    background: "./assets/img/green.png",
    img1: "./assets/img/bs2.png",
    address: "Ox8w...ae",
    status: "Bought",
    price: "0.8 BNB of HotHot",
    icon: "./assets/img/smile_up.png",
    className: "bought-slide",
  },
  {
    background: "./assets/img/orange.png",
    img1: "./assets/img/bs3.png",
    address: "Ox8w...ae",
    status: "Launched",
    price: "0.8 BNB of HotHot",
    icon: "./assets/img/smile_down.png",
    className: "launch-slide",
  },
  {
    background: "./assets/img/red.png",
    img1: "./assets/img/bs1.png",
    address: "Ox8w...ae",
    status: "sold",
    price: "0.8 BNB of HotHot",
    icon: "./assets/img/smile_down.png",
    className: "sold-slide",
  },
  {
    background: "./assets/img/green.png",
    img1: "./assets/img/bs2.png",
    address: "Ox8w...ae",
    status: "Bought",
    price: "0.8 BNB of HotHot",
    icon: "./assets/img/smile_up.png",
    className: "bought-slide",
  },
  {
    background: "./assets/img/orange.png",
    img1: "./assets/img/bs3.png",
    address: "Ox8w...ae",
    status: "Launched",
    price: "0.8 BNB of HotHot",
    icon: "./assets/img/smile_down.png",
    className: "launch-slide",
  },
  {
    background: "./assets/img/red.png",
    img1: "./assets/img/bs1.png",
    address: "Ox8w...ae",
    status: "sold",
    price: "0.8 BNB of HotHot",
    icon: "./assets/img/smile_down.png",
    className: "sold-slide",
  },
  {
    background: "./assets/img/green.png",
    img1: "./assets/img/bs2.png",
    address: "Ox8w...ae",
    status: "Bought",
    price: "0.8 BNB of HotHot",
    icon: "./assets/img/smile_up.png",
    className: "bought-slide",
  },
  {
    background: "./assets/img/orange.png",
    img1: "./assets/img/bs3.png",
    address: "Ox8w...ae",
    status: "Launched",
    price: "0.8 BNB of HotHot",
    icon: "./assets/img/smile_down.png",
    className: "launch-slide",
  },
];

// To enable infinite looping, we clone the last and first slide.
export default function BannerSlider() {
  const extendedSlides = [
    slidesData[slidesData.length - 1],
    ...slidesData,
    slidesData[0],
  ];

  const [current, setCurrent] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const slideWidthPercent = 100 / 3.5; // ~28.57%
  const autoSlideInterval = 3000; // Auto-slide every 3 seconds
  let slideTimer: NodeJS.Timeout;

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Auto-slide functionality
  useEffect(() => {
    slideTimer = setInterval(() => {
      nextSlide();
    }, autoSlideInterval);

    return () => clearInterval(slideTimer); // Cleanup on unmount
  }, [current]);

  const nextSlide = () => {
    setCurrent((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrent((prev) => prev - 1);
  };

  // Handle infinite loop transition
  useEffect(() => {
    if (current === extendedSlides.length - 1) {
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrent(1);
      }, 500);
      setTimeout(() => setTransitionEnabled(true), 510);
    }
    if (current === 0) {
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrent(extendedSlides.length - 2);
      }, 500);
      setTimeout(() => setTransitionEnabled(true), 510);
    }
  }, [current, extendedSlides.length]);

  // Handle drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (sliderRef.current?.offsetLeft || 0);
    scrollLeft.current = sliderRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2; // Speed factor
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      className="banner-slider"
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
      onMouseEnter={() => clearInterval(slideTimer)} // Pause on hover
      onMouseLeave={() =>
        (slideTimer = setInterval(() => nextSlide(), autoSlideInterval))
      } // Resume on mouse leave
    >
      <div
        ref={sliderRef}
        className="slider_items"
        style={{
          display: "flex",
          transition: transitionEnabled ? "transform 0.5s ease-in-out" : "none",
          transform: `translateX(-${current * slideWidthPercent}%)`,
          gap: "10px", // Add margin between slides
          cursor: isDragging.current ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {extendedSlides.map((slide, index) => (
          <div
            key={index}
            className={`item slides ${slide.className}`}
            style={{
              flex: `0 0 calc(100% / 3.5)`,
              background: `url('${slide.background}')`,
              backgroundSize: "cover",
              padding: "10px", // Add spacing inside slides
              borderRadius: "10px", // Optional styling
              marginRight:"50px",
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
      {/* <button
        onClick={prevSlide}
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
        }}
      >
        Prev
      </button> */}
      {/* <button
        onClick={nextSlide}
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
        }}
      >
        Next
      </button> */}
    </div>
  );
}
