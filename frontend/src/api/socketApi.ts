import { io } from "socket.io-client";


const SOCKET_URL = ((globalThis as any).process?.env?.REACT_APP_SOCKET_URL) || "http://localhost:4000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ['websocket']
});

export default socket;


