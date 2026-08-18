import { Request, Response, NextFunction } from "express";
import LoginError from "@Toolkits/Login/loginError.js";
import passport from "@Terminal/Passport/serialize_deserialize.js";
import { fetchGlobalTasksFeed } from "@Workshop/Payload/Mutations/getTaskService.js";
import redisClient from "@Terminal/Redis/redisCreateClient.js";

export const loginUser = (
  req: Request & {
    login(user: any, done: (err: any) => void): void;
  },
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) return next(new LoginError(info?.message || "user not found Register!!", 404));

    req.login(user, (err) => {
      if (err) return next(err);

      // 👉 1. Set cookie lifetime based on the rememberDevice flag attached to the user object
      if (req.session) {
        const rememberDevice = user.rememberDevice === true;
        req.session.cookie.maxAge = rememberDevice
          ? 30 * 24 * 60 * 60 * 1000 // 30 Days if checked
          : undefined;               // Session cookie (clears when browser closes)
      }

      req.session.save(async (sessionErr) => {
        if (sessionErr) return next(sessionErr);

        try {
          const fresh_load_pointer = 'Yes_Is_FreshLoad';

          const { tasksFeed, next_post_timestamp } = await fetchGlobalTasksFeed(
            user.uuid,
            fresh_load_pointer
          );

          const responseData = {
            tasks: tasksFeed,
            next_post_timestamp: next_post_timestamp !== undefined && next_post_timestamp !== null ? String(next_post_timestamp) : null,
            currentUserId: user.id,
            currentUserUuid: user.uuid
          };

          const cacheKey = `tasks_feed:${user.uuid}:${fresh_load_pointer}`;
          await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 86400 });
          console.log(`🔥 Redis Warmed Up on login for user: ${cacheKey}`);
        } catch (cacheError: unknown) {
          const cacheErrMsg = cacheError instanceof Error ? cacheError.message : String(cacheError);
          console.error("Failed to warm up Redis cache on login:", cacheErrMsg);
        }

        return res.status(200).json({
          message: "logged in successfully",
          user: {
            id: user.id,
            uuid: user.uuid
          }
        });
      });
    });
  })(req, res, next);
};