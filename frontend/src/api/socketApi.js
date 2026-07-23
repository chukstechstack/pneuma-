import { io } from "socket.io-client";


const SOCKET_URL = "http://localhost:4000" || "https://pneuma-api-0bvr.onrender.com";

 const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ['websocket']
});

export default socket;


