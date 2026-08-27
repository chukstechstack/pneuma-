import RegistrationError from "@Toolkits/Register/registrationError.js";
import bcryptjs from "bcryptjs";
import { findUserRegistration, registerNewUser } from "@Workshop/Vip/authService.js";
import { fetchGlobalTasksFeed } from "@Workshop/Payload/Mutations/getTaskService.js";
import redisClient from "@Terminal/Redis/redisCreateClient.js";
const saltRound = 10;
export const registerUser = async (req, res, next) => {
    const { password, full_name, email, google_id, avatar_url } = req.body;
    if (!password || !email) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const user = await findUserRegistration(email);
        if (user) {
            return res.status(400).json({ message: "user already exists" });
        }
        const hash = await bcryptjs.hash(password, saltRound);
        const registerPayload = {
            password: hash,
            full_name,
            email,
            google_id,
            avatar_url,
        };
        const newUser = (await registerNewUser(registerPayload));
        req.login(newUser, (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }
            req.session.save(async (sessionErr) => {
                if (sessionErr) {
                    return next(sessionErr);
                }
                try {
                    const fresh_load_pointer = 'Yes_Is_FreshLoad';
                    const { tasksFeed, next_post_timestamp } = await fetchGlobalTasksFeed(newUser.uuid, fresh_load_pointer);
                    const responseData = {
                        tasks: tasksFeed,
                        next_post_timestamp: next_post_timestamp !== undefined && next_post_timestamp !== null ? String(next_post_timestamp) : null,
                        currentUserId: newUser.id,
                        currentUserUuid: newUser.uuid
                    };
                    const cacheKey = `tasks_feed:${newUser.uuid}:${fresh_load_pointer}`;
                    await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 86400 });
                    console.log(`🔥 Redis Warmed Up with actual data for new user: ${newUser.uuid}`);
                }
                catch (cacheError) {
                    const cacheErrMsg = cacheError instanceof Error ? cacheError.message : String(cacheError);
                    console.error("Failed to warm up Redis cache during registration:", cacheErrMsg);
                }
                const successResponse = {
                    message: "user registered successfully",
                    user: {
                        id: newUser.id,
                        uuid: newUser.uuid,
                    },
                };
                return res.status(201).json(successResponse);
            });
        });
    }
    catch (err) {
        const pgError = err;
        if (pgError.code === "23505") {
            return next(new RegistrationError("Email already exists", 400));
        }
        next(err);
    }
};
//# sourceMappingURL=registerUser.js.map