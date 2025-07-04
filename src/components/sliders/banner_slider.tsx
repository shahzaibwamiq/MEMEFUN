"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {useEffect, useState } from "react";
import {ipfsLoader} from "@/utils/ipfsLoaders/ipfsLoader";


interface CoinSlide {
    id: number;
    name: string;
    token: string;
    logo: string;
    tag: string;
    description: string;
}
const tagToClass: Record<string, string> = {
    new: "launch-slide fa-beat-custom",
    Bought: "bought-slide",
    sold: "sold-slide",
    trending: "trending-slide",
};


interface BannerSlider {
    ApiUrl: string
}

export default function BannerSlider({ ApiUrl }: BannerSlider) {
    const [slidesData, setSlidesData] = useState<CoinSlide[]>([]);

    useEffect(() => {
        fetch(`${ApiUrl}/coin/coin-slider`) // Replace with your actual API route
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    let filledSlides = [...data.data];
                    while (filledSlides.length < 10) {
                        filledSlides = filledSlides.concat(
                            filledSlides.slice(0, 10 - filledSlides.length)
                        );
                    }
                    const shuffled = [...filledSlides].sort(() => 0.5 - Math.random());
                    setSlidesData(shuffled);
                }
            })
            .catch((err) => console.error("Failed to fetch slider data:", err));
    }, [ApiUrl]);

    return (
        <div style={{ position: "relative", padding: "50px 20px 0px 20px" }} className="banner-slider">
            <div
                className="slider_items"
                style={{
                    display: "flex",
                    gap: "15px",
                }}
            >
                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={2}
                    loop={slidesData.length >= 6}
                    // navigation
                    // pagination={{ clickable: true }}
                    autoplay={{ delay: 3000 }}
                    breakpoints={{
                        375: { slidesPerView: 1 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 5 },
                    }}
                >
                    {slidesData.map((slide, index) => {
                        const imageUrl = slide.logo || `https://memesfun.mypinata.cloud/ipfs/bafkreicgshszjb37waaku4ll5azvlxrsk7wsodg6fkdn5yohquhbbvv4cu`;

                        return(
                        <SwiperSlide
                            key={index}
                        >
                            <div
                                key={index}
                                className={`item slides ${tagToClass[slide.tag] || ""}`}
                                style={{
                                    flex: `0 0 calc(100% / 5.5)`,
                                    backgroundSize: "cover",
                                    padding: "10px",
                                    borderRadius: "10px",
                                    width:"100%"
                                }}
                            >
                                <div className="d-flex">
                                    <Image
                                        loader={ipfsLoader}
                                        width={125}
                                        height={138}
                                        src={imageUrl}
                                        alt={slide.name}
                                        className="img1"
                                    />
                                    <div className="cont">
                                        <div className="badge d-flex">
                                            <strong>{slide.token.slice(0, 6)}...{slide.token.slice(-4)}</strong>
                                            <span className="sold">{slide.tag}</span>
                                        </div>
                                        <p>{slide.description?.slice(0, 25)}...</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
        </div>
    );
}
