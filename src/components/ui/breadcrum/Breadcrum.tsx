"use client";

import Link from "next/link";

interface BreadcrumbProps {
    title: string; // The title of the current page
}

export default function Breadcrum({ title }: BreadcrumbProps) {
    return (
        <section className="breadcrum">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        {/* Link to home page */}
                        <Link href="/" className="home_page">Home</Link>

                        {/* Separator icon */}
                        <div className="icon">
                            <i className="fa-solid fa-chevron-right"></i>
                        </div>

                        {/* Current page title */}
                        <a href="#" className="current">{title}</a>
                    </div>
                </div>
            </div>
        </section>
    );
};
