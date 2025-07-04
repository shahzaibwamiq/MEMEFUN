'use client'
import Link from "next/link";


export default function notFound() {
    return (
        <div className="NotFound col-md-12 text-center">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>
                Sorry, the page you are looking for does not exist.
            </p>
            <div>
                <Link href="/">Return To Home</Link>
            </div>
        </div>
    );
};