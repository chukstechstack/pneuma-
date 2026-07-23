import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import cors from "cors";
import passport from "./src/db/passport/serialize_deserialize.js";
import pool from "./src/db/config/supabaseConfig.js";
import authRoute from "./src/routes/authroute.js";
import taskRoute from "./src/routes/taskroute.js";

const app = express();
const PostgresStore = pgSession(session);


app.use(cors({
  origin: ['https://pneuma-frontend-oijl.onrender.com', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
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
const sessionCookieConfig = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24 * 5,
};

const sessionOptions = {
  store: sessionStore,
  cookie: sessionCookieConfig,
  secret: process.env.SESSION_SECRET,
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

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: err.message || "something went wrong",
  });
});

export default app;