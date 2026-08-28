import { io } from "socket.io-client";

declare global {
  interface ImportMetaEnv {
    readonly VITE_SOCKET_URL?: string;
    readonly PROD?: boolean;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}


const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.PROD ? "https://pneuma-api-0bvr.onrender.com" : "http://localhost:4000");
const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ['polling', 'websocket'] // Allow polling fallback
});

export default socket;