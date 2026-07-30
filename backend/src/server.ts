import dotenv from "dotenv";
import pool from "@/Terminal/Supabase/supabaseConfig.js";
import redisClient from "@/Terminal/Redis/redisCreateClient.js"; 
import { createServer, Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import app from "./app.js";
import { getErrorMessage } from "./Toolkit/GetErrorMessage/getErrorMessage.js";
import { UserUuidPayload } from "@shared/types.js";
dotenv.config();``

const PORT: string | number = process.env.PORT || 4000;



const startServer = async (): Promise<void> => {
  try {
    await pool.connect();
    console.log("🔥  Connected to Supabase PostgreSQL");

    await redisClient.connect();
    console.log("📌 Connected to Redis");

    const httpServer: HttpServer = createServer(app);

    const io: Server = new Server(httpServer, {
      cors: {
        origin: ['https://pneuma-frontend-oijl.onrender.com', 'http://localhost:5173', 'http://localhost:3000'],
        credentials: true
      }
    });

    app.set("socketio", io);

    io.on("connection", (socket: Socket) => {
      console.log(`⚡ User connected to WebSocket: ${socket.id}`);

      socket.on("current_Logged_In_User_Uuid", (data: UserUuidPayload) => {
        const { userUuid } = data;
        if (userUuid) {
          socket.join(`current_Logged_In_User_Uuid:${userUuid}`);
          console.log(`🔒 Secure room locked for User UUID: ${userUuid} on Socket: ${socket.id}`);
        }
      });

      socket.on("disconnect", () => {
        console.log(`🔌 User disconnected: ${socket.id}`);
      });
    });

    httpServer.listen(PORT, () => console.log(`♨️   Living Server running at PORT: ${PORT}`));

  } catch (err: unknown) {
    console.error("☠️ Failed to connect:", getErrorMessage(err));
    process.exit(1);
  }
};

startServer();