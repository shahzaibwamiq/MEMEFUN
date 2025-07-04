'use client';

import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import { getCookie } from "@/utils/cookies/AuthCookies";
import { logout } from "@/store/slice/authSlice"
import {useChain} from "@cosmos-kit/react";
import { RootState } from "@/store/store";


export const CookieAutoLogout = () => {
    const { address, connect } = useChain(`${process.env.NEXT_PUBLIC_CHAIN_NAME}`, true);
    const prevAddress: string | null = useSelector((state: RootState) => state.auth.Wallet?.address || null);
    const dispatch = useDispatch();
    useEffect(() => {
        const interval = setInterval(() => {
            const token = getCookie("AuthToken");
            const user = getCookie("AuthUser");
            if (!token || !user || !address) {
                dispatch(logout());
                clearInterval(interval);
            }
            if (prevAddress !== address) {
                dispatch(logout());
                clearInterval(interval);
                connect();
            }
        }, 3000); // check every 10 sec

        return () => clearInterval(interval);
    }, [dispatch, address]);

    return null;
}