"use client";

import Link from "next/link";

interface BreadcrumbProps {
  title: string;
}

export default function Breadcrum({ title }: BreadcrumbProps) {
  return (
    <section className="breadcrum">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Link href="/" className="home_page">
              Home
            </Link>
            <div className="icon">
              <i className="fa-solid fa-chevron-right"></i>
            </div>
            <Link href="#" className="current">
              {title}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
