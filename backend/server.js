import express from "express";
import dotenv from "dotenv";
import pool from "./config/supabaseConfig.js";
import passport from "./config/passport/serialize_deserialize.js";
import session from "express-session";
import pgSession from "connect-pg-simple";
import cors from "cors";
import mainAuthRoute from "./routes/main/mainauthrouter.js";
import mainTaskRoute from "./routes/main/maintaskrouter.js";
import redisClient from "./config/redisCreateClient.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();
const PostgresStore = pgSession(session)

app.use(cors({
  origin: ['https://pneuma-frontend-oijl.onrender.com', 'http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.enable('trust proxy');

const sessionStore = new PostgresStore({
  pool: pool,
  tableName: 'session',
  createTableIfMissing: true
});

const isProduction = process.env.NODE_ENV === "production"
const sessionCookieConfig = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24 * 5,
}

const sessionOptions = {
  store: sessionStore,
  cookie: sessionCookieConfig,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  rolling: true
}

app.use(session(sessionOptions))
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000;

app.use("/auth", mainAuthRoute);
app.use("/task", mainTaskRoute);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: err.message || "something went wrong",
  });
});

const startServer = async () => {
  try {
    await pool.connect();
    console.log("✅ Connected to Supabase PostgreSQL");

    await redisClient.connect();
    console.log(" 🚀 Connected to Redis")

    const httpServer = createServer(app);

    const io = new Server(httpServer, {
      cors: {
        origin: ['https://pneuma-frontend-oijl.onrender.com', 'http://localhost:5173', 'http://localhost:5174'],
        credentials: true
      }
    });

    app.set("socketio", io);

    io.on("connection", (socket) => {
      console.log(`⚡ User connected to WebSocket: ${socket.id}`);

      socket.on("current_Logged_In_User_Uuid", (data) => {
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

    httpServer.listen(PORT, () => console.log(`🚀 Living Server running at PORT: ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to connect:", err.message);
    process.exit(1);
  }
};

startServer();