import type { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import { findUserByEmail } from "../../Workshop/Vip/passportService.js";
import LoginError from "@Toolkits/Login/loginError";

export const initLocalStrategy = (passport: PassportStatic) => {
  passport.use(
    "local",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          if (!email) throw new LoginError("email required", 400);
          if (!password) throw new LoginError("password required", 400);

          const user = await findUserByEmail(email);

          if (!user || !user.password) {
            return done(null, false, { message: "User not found" });
          }

          const isValid = await bcryptjs.compare(password, user.password);
          if (isValid) {
            delete user.password; // Strip the sensitive hash
            return done(null, user);
          } else {
            return done(null, false, { message: "incorrect Password" });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
