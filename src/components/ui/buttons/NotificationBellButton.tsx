'use client';

import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import Image from 'next/image';
import {ipfsLoader} from "@/utils/ipfsLoaders/ipfsLoader";
import { useSocket } from "@/providers/SocketProvider";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface Receiver {
    id: number;
    name: string;
    profile_photo_path: string;
}
interface Notification {
    id: number;
    message: string;
    createdAt?: string;
    receiver: Receiver
}

interface NotificationState {
    notification: Notification;
}


export default function NotificationBellButton() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const token = useSelector((state: RootState) => state.auth.token);
    const ApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { socket } = useSocket();


    const getNotifications = useCallback(async () => {
        try {
            const response = await axios.get(`${ApiUrl}/notification/notifications`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 && Array.isArray(response.data.data)) {
                setNotifications(response.data.data.reverse()); // newest first
            } else {
                setNotifications([]);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
        }
    },[ApiUrl, token]);
    useEffect(() => {
        if (!socket) return;
        getNotifications();

        const onNotification = (msg: { type: string; data: NotificationState }) => {
            if (msg.type === 'notification') {
                setNotifications((prev) => {
                    const exists = prev.some((n) => n.id === msg.data.notification.id);
                    return exists ? prev : [msg.data.notification, ...prev];
                });
            }
        };

        socket.on('notification', onNotification);


        return () => {
            socket.off('notification', onNotification);
        };
    }, [token, getNotifications, socket]);

    return (
        <div className={`notifcation`}>
            <a
                onClick={() => setOpen(!open)}
                className="text-xl p-2 rounded hover:bg-gray-100 transition cursor-pointer"
            >
                <FontAwesomeIcon icon={faBell} />
            </a>

            {open && (
                <div className="notification_list">
                    <button onClick={() => setOpen(!open)}
                       className={'close_btn'}><i className="fa-solid fa-xmark"></i></button>
                    <h6>All Notifications</h6>
                    <ul className="divide-y divide-gray-100">
                        {notifications.length === 0 && (
                            <li className="p-4 text-gray-500">No notifications yet.</li>
                        )}
                        {notifications.map((notif) => {
                            const imagePath = notif.receiver?.profile_photo_path || '';
                            const imageSrc = imagePath?.startsWith('http')
                                ? imagePath
                                : `https://${imagePath}`;

                            return (
                                <li key={notif.id} className="d-flex p-2">
                                    <div className="multi_border">
                                        <Image
                                            loader={ipfsLoader}
                                            src={imageSrc}
                                            alt={notif.receiver?.name}
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div className="cont">
                                        <span className="not_txt">{notif.message}</span>
                                        <span className="time">
                                            {notif.createdAt ? dayjs(notif.createdAt).fromNow() : 'Just now'}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
