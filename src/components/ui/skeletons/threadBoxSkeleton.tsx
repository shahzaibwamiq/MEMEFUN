"use client";

export default function ThreadBoxSkeleton() {
    return (
        <>
            {[...Array(4)].map((_, index) => (
                <div key={index} className="threads_box animate-pulse thread-skeleton flex space-x-4 mb-4">
                    {/* Circle Avatar Placeholder */}
                    <div className="skeleton-circle w-[61px] h-[61px] bg-gray-300 rounded-full"></div>

                    {/* Thread Content Placeholder */}
                    <div className="thread_cont flex-1">
                        <div className="th_head d-flex justify-between skeleton-text short items-center mb-2">
                            <div className="h-4 bg-gray-300 rounded w-32"></div>
                            <div className="flex items-center space-x-2">
                                <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-20"></div>
                            </div>
                        </div>

                        <div className="h-4 bg-gray-300 rounded w-full mb-1 skeleton-text long"></div>
                        <div className="h-4 bg-gray-300 rounded w-[90%] mb-1 skeleton-text short "></div>
                    </div>
                </div>
            ))}
        </>
    );
}
