import RegistrationError from "../../utils/registrationError.js";
import bcryptjs from "bcryptjs";
import { findUserRegistration, registerNewUser } from "../../services/auth/authService.js";
import redisClient from "../../config/redisCreateClient.js"; // 1. Import Redis Client
import { fetchGlobalTasksFeed } from "../../services/task/getTaskService.js"; // 2. Import Feed Service

const saltRound = 10;

export const registerUser = async (req, res, next) => {
  let { password, first_name, last_name, email, google_id, avatar_url } = req.body;

  // ... keep your validation trims and checks exactly the same ...

  try {
    const user = await findUserRegistration(email);
    if (user) return res.status(400).json({ message: "user already exists" });

    const hash = await bcryptjs.hash(password, saltRound);

    const newUser = await registerNewUser({
      password: hash, first_name, last_name, email, google_id, avatar_url,
    });

    req.login(newUser, (err) => {
      if (err) return next(err);

      req.session.save(async (sessionErr) => { // 3. Make this callback async
        if (sessionErr) return next(sessionErr);

        try {
          // 4. WARM UP CACHE: Fetch feed for the new user's UUID immediately
          const tasksFeed = await fetchGlobalTasksFeed(newUser.uuid);
          const responseData = { tasks: tasksFeed, currentUserId: newUser.id };

          const cacheKey = `tasks_feed:${newUser.uuid}`;
          await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 600 });
          console.log(`🔥 Redis Warmed Up for user: ${newUser.uuid}`);
        } catch (cacheError) {
          console.error("Failed to warm up Redis cache:", cacheError);
          // Don't block registration if Redis warm up fails
        }

        return res.status(201).json({
          message: "user registered successfully",
          user: {
            id: newUser.id,
            uuid: newUser.uuid
          }
        });
      });
    });

  } catch (err) {
    if (err.code === "23505") return next(new RegistrationError("Email already exists", 400));
    next(err);
  }
};
