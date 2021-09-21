import create, { StateCreator } from "zustand";
import io, { Socket } from "socket.io-client";

interface SocketStore {
    socket: Socket;
}

const socketStore: StateCreator<SocketStore> = () => {
    const socket = io("http://localhost:4000", {
        withCredentials: true,
        transports: ["websocket"],
    });
    return {
        socket,
    };
};

const useSocketStore = create(socketStore);

export function useSocket() {
    return useSocketStore((s) => s.socket);
}
