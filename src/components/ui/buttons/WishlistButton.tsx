import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import {useEffect, useState} from "react";
import axios from "axios";
import {usePopup} from "@/providers/PopupProvider";

interface WishlistButtonProps {
    itemId: string;
    token?: string;
    ApiUrl?: string;
    isAdded?: boolean;
    onRemoveFromUI?: (token: string) => void;
}

export default function WishlistButton({ itemId, token, ApiUrl, isAdded, onRemoveFromUI }: WishlistButtonProps) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const { showPopup } = usePopup();


    const handleFavoriteClick = async () => {
        const previousState = isFavorited;
        const newState = !isFavorited;
        setIsFavorited(newState);
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 200);
        try {
            const response = await axios.post(`${ApiUrl}/wishlist/add-remove-wishlist`, {
                postId: itemId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                setIsFavorited(true);
                showPopup("Added To Wishlist", 'success');
            } else if (response.status === 200) {
                setIsFavorited(false);
                showPopup("Removed From Wishlist", "warning");
                onRemoveFromUI?.(itemId);
            } else {
                setIsFavorited(previousState);
                showPopup("Unexpected server response", "error");
            }

        } catch (e: unknown) {
            setIsFavorited(previousState);
            if (axios.isAxiosError(e)) {
                const statusCode = e.response?.status;
                if (statusCode === 400) {
                    showPopup("Coin Not Found", "error");
                } else {
                    showPopup("Something went wrong", "error");
                }
            } else {
                console.error("Wishlist toggle failed:", e);
                showPopup("Something went wrong", "error");
            }
        }
    };

    useEffect(() => {
        if (isAdded) {
            setIsFavorited(true)
        }
    },[isAdded]);

    return (
        <>
            <button className={`${itemId} wishlist_icon ${isClicked ? 'clicked' : ''}`} onClick={handleFavoriteClick}>
                <FontAwesomeIcon
                    icon={isFavorited ? solidStar : regularStar}
                />
            </button>
        </>
    );
}
