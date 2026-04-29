import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";

const BASE_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:3000"
        : import.meta.env.VITE_API_URL;

// Singleton socket instance shared across all hook consumers
let socketInstance = null;
let refCount = 0;

function getOrCreateSocket() {
    if (!socketInstance) {
        socketInstance = io(BASE_URL, {
            autoConnect: false,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });
    }
    return socketInstance;
}

/**
 * Custom hook that manages a singleton Socket.IO connection.
 *
 * - Auto-connects when the user is authenticated.
 * - Auto-disconnects when no components are using it (ref-counted).
 * - Provides `joinRoom` / `leaveRoom` helpers.
 *
 * @returns {{ socket: import("socket.io-client").Socket | null, joinRoom: (room: string) => void, leaveRoom: (room: string) => void }}
 */
export function useSocket() {
    const { isAuthenticated } = useAuthStore();
    const socketRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated) {
            // Disconnect if we were connected and auth was lost (logout)
            if (socketInstance?.connected) {
                socketInstance.disconnect();
            }
            socketRef.current = null;
            return;
        }

        const socket = getOrCreateSocket();
        socketRef.current = socket;
        refCount++;

        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            refCount--;
            if (refCount <= 0) {
                refCount = 0;
                socket.disconnect();
                socketInstance = null;
                socketRef.current = null;
            }
        };
    }, [isAuthenticated]);

    const joinRoom = (type, id) => {
        socketRef.current?.emit(`join:${type}`, id);
    };

    const leaveRoom = (type, id) => {
        socketRef.current?.emit(`leave:${type}`, id);
    };

    return {
        socket: socketRef.current,
        joinRoom,
        leaveRoom,
    };
}
