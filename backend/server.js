import express from "express";
import dotenv from "dotenv";
import pool from "./config/db.js";
import { mainAuthRouter } from "./routes/main/mainAuthRouter.js";
import passport from "./config/passport.js";
import session from "express-session";
import cors from "cors";
import mainTaskRouter from "./routes/main/mainTaskRouter.js";

// import crypto from "crypto";
// const sessionSecret = crypto.randomBytes(32).toString('hex');
// console.log(sessionSecret)

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000;

app.use("/auth", mainAuthRouter);
app.use("/task", mainTaskRouter);
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

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect:", err.message);
    process.exit(1);
  }
};

startServer();
