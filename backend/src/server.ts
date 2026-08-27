import dotenv from "dotenv";
import pool from "@/Terminal/Supabase/supabaseConfig.js";
import redisClient from "@/Terminal/Redis/redisCreateClient.js";
import { createServer, Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import app from "./app.js";
import { getErrorMessage } from "./Toolkit/GetErrorMessage/getErrorMessage.js";
import { registerMessagingGateway } from "./Routes/Gateway/messagingGateway.ts.js"; // Adjust path if needed

dotenv.config();

const PORT: string | number = process.env.PORT || 4000;

const startServer = async (): Promise<void> => {
  try {
    await pool.connect();
    console.log("🔥 Connected to Supabase PostgreSQL");

    await redisClient.connect();
    console.log("📌 Connected to Redis");

    const httpServer: HttpServer = createServer(app);

    const socketServerCors: Server = new Server(httpServer, {
      cors: {
        origin: ['https://pneuma-frontend-oijl.onrender.com', 'http://localhost:5173', 'http://localhost:3000',  'http://localhost:3001'],
        credentials: true
      }
    });

    app.set("socketio", socketServerCors);

    socketServerCors.on("connection", (socket: Socket) => {
      console.log(`⚡ User connected to WebSocket: ${socket.id}`);

      // 🌟 Allow clients to join their personal user UUID room for broadcasting
      socket.on("join_user_room", (userUuid: string) => {
        if (userUuid) {
          socket.join(userUuid);
          console.log(`🏠 Socket ${socket.id} joined personal room: ${userUuid}`);
        }
      });

      registerMessagingGateway(socketServerCors, socket);

      socket.on("disconnect", () => {
        console.log(`🔌 User disconnected: ${socket.id}`);
      });
    });

    httpServer.listen(PORT, () => console.log(`♨️ Living Server running at PORT: ${PORT}`));

  } catch (err: unknown) {
    console.error("☠️ Failed to connect:", getErrorMessage(err));
    process.exit(1);
  }
};

startServer();