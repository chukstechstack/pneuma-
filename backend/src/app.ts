import express, { Request, Response, NextFunction } from "express";
import session, { CookieOptions, SessionOptions } from "express-session";
import pgSession from "connect-pg-simple";
import cors from "cors";
import passport from "@/Terminal/Passport/serialize_deserialize.js";
import pool from "@/Terminal/Supabase/supabaseConfig.js";
import authRoute from "@/Routes/Vip/authroute.js";
import taskRoute from "@/Routes/Payload/taskroute.js";
import AppError from "@/Toolkit/AppError/appError.js";

const app = express();
const PostgresStore = pgSession(session);

app.use(cors({
  origin: ['https://pneuma-frontend-oijl.onrender.com', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.enable('trust proxy');

const sessionStore = new PostgresStore({
  pool: pool,
  tableName: 'session',
  createTableIfMissing: true
});

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax"),
  maxAge: 1000 * 60 * 60 * 24 * 5,
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable is missing!");
}


const sessionOptions: SessionOptions = {
  store: sessionStore,
  cookie: cookieOptions,
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  rolling: true
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/task", taskRoute);

app.use((err: Error | AppError, req: Request, res: Response, next: NextFunction): void => {
  console.error(err);

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    error: message,
  });
});

export default app;