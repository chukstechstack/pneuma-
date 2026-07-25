import LoginError from "../../../utils/loginError.js";
import passport from "passport";

export const googleLogin = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
};
