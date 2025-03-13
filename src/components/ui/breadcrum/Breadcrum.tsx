"use client";

import Image from "next/image";
interface BreadcrumbProps {
    title: string;
  }
  
export default function Breadcrum({ title }: BreadcrumbProps) {
    return (
 <section className="breadcrum">
    <div className="container">
        <div className="row">
            <div className="col-12">
                <a href="/" className="home_page">Home</a><div className="icon"><i className="fa-solid fa-chevron-right"></i></div><a href="#" className="current">{title}</a>
            </div>
        </div>
    </div>
 </section>

  );
}
