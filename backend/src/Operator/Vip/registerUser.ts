import RegistrationError from "@Toolkits/Register/registrationError";
import bcryptjs from "bcryptjs";
import { findUserRegistration, registerNewUser } from "@Workshop/Vip/authService"
import redisClient from "@Terminal/Redis/redisCreateClient";
import type { Request, Response, NextFunction } from "express";
import type { Session, SessionData } from "express-session";

const saltRound = 10;

interface RegisterRequestBody {
  password?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  google_id?: string;
  avatar_url?: string;
  [key: string]: unknown;
}

interface PassportRequest extends Request<Record<string, string>, unknown, RegisterRequestBody> {
  session: Session & Partial<SessionData>;
}

interface RegisteredUser {
  id: number | string;
  uuid: string;
  [key: string]: unknown;
}

interface RegisterResponseData {
  message: string;
  user: {
    id: number | string;
    uuid: string;
  };
}

export const registerUser = async (
  req: PassportRequest,
  res: Response<RegisterResponseData | { message: string; error?: string }>,
  next: NextFunction
) => {
  const { password, first_name, last_name, email, google_id, avatar_url } = req.body;

  if (!password || !email) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await findUserRegistration(email);
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }

    const hash = await bcryptjs.hash(password, saltRound);

    const newUser = (await registerNewUser({
      password: hash,
      first_name,
      last_name,
      email,
      google_id,
      avatar_url,
    })) as RegisteredUser;

    req.login(newUser, (loginErr: unknown) => {
      if (loginErr) {
        return next(loginErr);
      }

      req.session.save(async (sessionErr: unknown) => {
        if (sessionErr) {
          return next(sessionErr);
        }

        try {
          const responseData = { tasks: [], currentUserId: newUser.id };
          const cacheKey = `tasks_feed:${newUser.uuid}`;
          await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 600 });
          console.log(`🔥 Redis Warmed Up for new user: ${newUser.uuid}`);
        } catch (cacheError: unknown) {
          const cacheErrMsg = cacheError instanceof Error ? cacheError.message : String(cacheError);
          console.error("Failed to warm up Redis cache:", cacheErrMsg);
        }

        const successResponse: RegisterResponseData = {
          message: "user registered successfully",
          user: {
            id: newUser.id,
            uuid: newUser.uuid,
          },
        };

        return res.status(201).json(successResponse);
      });
    });

  } catch (err: unknown) {
    const pgError = err as { code?: string; message?: string };
    if (pgError.code === "23505") {
      return next(new RegistrationError("Email already exists", 400));
    }
    next(err);
  }
};