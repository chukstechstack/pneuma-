import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import { findUserByEmail } from "../../services/Auth/passportService.js";
import LoginError from "../../utils/Login/loginError.js";

export const initLocalStrategy = (passport) => {
  passport.use(
    "local",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          if (!email) throw new LoginError("email required", 400);
          if (!password) throw new LoginError("password required", 400);

          const user = await findUserByEmail(email);

          if (!user) {
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
