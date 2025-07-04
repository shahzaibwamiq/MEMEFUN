"use client";

import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Tooltip from "../tooltips/tooltips";
import { usePopup } from "@/providers/PopupProvider";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const formSchema = z.object({
    description: z
        .string()
        .min(3, "Description must be at least 3 characters")
        .max(500, "Description cannot exceed 500 characters"),
});

interface CommentProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    tokenId: string;
    parentId?: number;
}

export default function CommentModal({ isOpen, onClose, onSuccess, tokenId, parentId }: CommentProps) {
    const token = useSelector((state: RootState) => state.auth.token);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const ApiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    const [isLoading, setIsLoading] = useState(false);
    const { showPopup } = usePopup();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
        },
    });

    if (!isOpen || !isAuthenticated) return null;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);

            const response = await fetch(`${ApiUrl}/comment/create-comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    postId: tokenId,
                    content: values.description,
                    ...(parentId ? { parentId } : {}),
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                showPopup("Commented Successfully!", "success");
                form.reset();
                onClose();
                if (onSuccess) onSuccess();
            } else {
                showPopup(result.message || "Failed to post your comment.", "error");
            }
        } catch (err) {
            const errorMsg =
                typeof err === "object" && err !== null && "message" in err
                    ? String((err as { message: unknown }).message)
                    : "Something went wrong while posting the comment.";
            showPopup(errorMsg, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="position-fixed connect_wallet comment_modal top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
            style={{ zIndex: 9999 }}
        >
            <div className="modal-dialog modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header">
                        <h5 className="modal-title">Comment</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close">
                            <FaTimes size={20} className="text-gray-600 cursor-pointer" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="fields_div">
                                <div className="row">
                                    <div className="col-12">
                                        <Tooltip
                                            text="Describe your thoughts, feedback, or response clearly."
                                            position="top"
                                        >
                      <textarea
                          placeholder="Type your comment..."
                          className="w-full"
                          {...form.register("description")}
                      ></textarea>
                                        </Tooltip>
                                        {form.formState.errors.description && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {form.formState.errors.description.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="col-12 token_meth">
                                        <button
                                            type="submit"
                                            className="w-full submit_btn theme_btn"
                                            disabled={isLoading || !token}
                                        >
                                            {isLoading ? "Posting..." : token ? "Post Comment" : "Connect Wallet"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
