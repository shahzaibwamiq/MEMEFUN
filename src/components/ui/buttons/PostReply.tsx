"use client";

import CommentModal from "@/components/ui/modals/ReplyCommentModal";
import { useState, useEffect } from "react";
import { usePopup } from "@/providers/PopupProvider";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {useChain} from "@cosmos-kit/react";
import Image from "next/image";

interface ReplyButtonProps{
    tokenId?: string
    parentId?: number
    TotalThreads: number;
    onPostSuccess?: () => void;
}


export default function ReplyButton({tokenId, parentId, TotalThreads, onPostSuccess }: ReplyButtonProps) {

    const isAuthenticated: boolean | null = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState<string>("");

    const { openView } = useChain(`${process.env.NEXT_PUBLIC_CHAIN_NAME}`, true);

    const { showPopup } = usePopup();

    useEffect(() => {
        if(TotalThreads === 0){
            setText('Start Thread')
        }else{
            setText('Post a Reply')
        }

    }, [TotalThreads]);

    useEffect(() => {
        if (isOpen && !isAuthenticated) {
            showPopup('Wallet connectivity required.', 'error');
            setIsOpen(false);
            openView();
        }

    }, [isAuthenticated, showPopup, isOpen, openView]);

    return (
        <>
            {parentId ? (
                <button className="reply_btn" onClick={() => setIsOpen(!isOpen)}>
                    Reply{" "}
                    <Image
                        alt=""
                        width={16}
                        height={14}
                        src={"/assets/img/reply.png"}
                    />
                </button>
                ):(
                <button onClick={() => setIsOpen(!isOpen)}>
                    {text}
                </button>
            )}

            {/* Modal component that opens when isOpen is true */}
            {isAuthenticated && tokenId &&(
                <CommentModal
                    parentId={parentId}
                    tokenId={tokenId}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onSuccess={() => {
                        if (onPostSuccess) {
                           onPostSuccess(); // <-- Trigger re-fetch from parent
                        }
                    }}
                />
            )}
        </>
    );
};
