import { ipfsLoader } from "@/utils/ipfsLoaders/ipfsLoader";
import Image from "next/image";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import ReplyButton from "@/components/ui/buttons/PostReply";
import { useState } from "react";
import axios from "axios";

interface User {
    id: number;
    name: string;
    profile_photo_path: string;
};

export interface ThreadBoxProps {
    content: string;
    createdAt: string;
    id: number;
    parentId: number | null;
    postId: number;
    replies: ThreadBoxProps[];
    updatedAt: string;
    user: User;
    userId: number;
    repliedTo?: string;
    tokenId?: string;
    threadLenght: number;
    userLiked?: boolean;
    LikesCount?: number;
};

function formatCustomDate(dateString: string): string {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const getOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;

    return `${getOrdinal(day)} ${month}, ${year} | ${hour12}:${minutes} ${ampm}`;
}

function ThreadBox(thread: ThreadBoxProps) {
    const imageSrc = thread.user.profile_photo_path?.startsWith("http")
        ? thread.user.profile_photo_path
        : `https://${thread.user.profile_photo_path}`;
    const isAuthenticated: boolean | null = useSelector((state: RootState) => state.auth.isAuthenticated);
    const token: string | null = useSelector((state: RootState) => state.auth.token);
    const ApiUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;
    
    const [isLiked, setIsLiked] = useState<boolean>(thread.userLiked || false);
    const [likeCount, setLikeCount] = useState<number>(thread.LikesCount || 0);
    const [isLiking, setIsLiking] = useState<boolean>(false);

    const handleLikeClick = async () => {
        if (!isAuthenticated || !token || !ApiUrl || isLiking) return;

        setIsLiking(true);
        try {
            const response = await axios.post(`${ApiUrl}/likes/like`, {
                likedItemId: thread.id,
                likedItemType: "comment"
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response?.data.success) {
                const likedStatus = response.data.liked;
                setIsLiked(likedStatus === "liked");
                setLikeCount(response.data.likeCount || likeCount);
            } else {
                console.warn(response?.data.message || "Failed to like/unlike.");
            }
        } catch (error) {
            console.error("Like/unlike failed:", error);
        } finally {
            setIsLiking(false);
        }
    };

    return (
        <>
            <div className="threads_box" id={`thread-${thread.id}`}>
                <Image
                    loader={ipfsLoader}
                    alt=""
                    width={61}
                    height={61}
                    src={imageSrc}
                />
                <div className="thread_cont">
                    {thread.repliedTo && (
                        <span
                            className="replied-to"
                            onMouseEnter={() => {
                                const parent = document.getElementById(`thread-${thread.parentId}`);
                                if (parent) parent.classList.add("highlight-thread");
                            }}
                            onMouseLeave={() => {
                                const parent = document.getElementById(`thread-${thread.parentId}`);
                                if (parent) parent.classList.remove("highlight-thread");
                            }}
                        >
                            Replied to {thread.repliedTo}
                        </span>
                    )}
                    <div className="th_head d-flex justify-content-between">
                        <h6>{thread.user.name}</h6>
                        <div className="time">
                            <button 
                                onClick={handleLikeClick}
                                disabled={!isAuthenticated || isLiking}
                                className={`like-button ${thread.userLiked ? 'liked' : ''} ${isLiking ? 'liking' : ''}`}
                            >
                                <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`}></i>
                            </button>
                            <span>
                                <i className="fa-regular fa-clock"></i>
                                {formatCustomDate(thread.createdAt)}
                            </span>
                        </div>
                    </div>
                    <p>{thread.content}</p>

                    {isAuthenticated ? (
                        <ReplyButton parentId={thread.id} tokenId={thread.tokenId} TotalThreads={thread?.threadLenght} />
                    ) : null}

                </div>
            </div>
            {thread.replies.map((reply) => (
                <ThreadBox key={`reply-${thread.id}-${reply.id}`} {...reply} repliedTo={thread.user.name} tokenId={thread.tokenId} threadLenght={thread?.threadLenght} />
            ))}
        </>
    );
}

export default ThreadBox;