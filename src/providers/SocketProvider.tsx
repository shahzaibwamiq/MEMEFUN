// providers/SocketProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { initSocket } from '@/utils/WebSockets';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface SocketContextType {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        let s;
        if(token){
            s = initSocket(token);
            setSocket(s);
        }else{
            s = initSocket();
            setSocket(s);
        }


        // return () => {
        //     if (s) s.disconnect();
        // };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
}
