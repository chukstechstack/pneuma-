import express from "express";
import dotenv from "dotenv";
import pool from "./config/supabaseConfig.js";
import mainAuthRoute from "./routes/main/mainauthrouter.js";
// Change this line inside your server.js:
import passport from "./config/passport/serialize_deserialize.js";

import session from "express-session";
import pgSession from "connect-pg-simple";
import cors from "cors";
import mainTaskRoute from "./routes/main/maintaskrouter.js";
import redisClient from "./config/redisCreateClient.js";



// import crypto from "crypto";
// const sessionSecret = crypto.randomBytes(32).toString('hex');
// console.log(sessionSecret)

dotenv.config();
const app = express();
const PostgresStore = pgSession(session)

const allowedOrigins = [
  'https://pneuma-frontend-oijl.onrender.com',
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL
];

// Define once
const corsOptions = {
  origin: function (origin, done) {
    if (!origin) return done(null, true);
    if (allowedOrigins.includes(origin)) {
      done(null, true);
    } else {
      console.log("CORS blocked this origin:", origin);
      done(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Use everywhere
app.use(cors(corsOptions));
app.options('/*info', cors(corsOptions)); // ✅ same config, not bare cors();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.enable('trust proxy'); // Add this line!
// app.set('trust proxy', true);

// Separate the Database Store Instance
const sessionStore = new PostgresStore({
  pool: pool,
  tableName: 'session',
  createTableIfMissing: true
});

//  Separate the Cookie Configuration Object
const isProduction = process.env.NODE_ENV === "production"
const sessionCookieConfig = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24 * 5,  // 5 days
}

//  Initialize the Final Middleware
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

    app.listen(PORT, () => console.log(`🚀 Server running at PORT: ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to connect:", err.message);
    process.exit(1);
  }
};

startServer();
