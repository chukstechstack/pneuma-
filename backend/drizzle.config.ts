import dotenv from "dotenv";
dotenv.config();
export default {
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./src/drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
} as const;
