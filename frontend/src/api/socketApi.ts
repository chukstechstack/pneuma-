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

// Use Vite's import.meta.env for production/local URL switching
const SOCKET_URL = 
  import.meta.env.VITE_SOCKET_URL || 
  (import.meta.env.PROD ? "https://pneuma-frontend-oijl.onrender.com" : "http://localhost:4000");

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ['websocket']
});

export default socket;