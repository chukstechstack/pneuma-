import express from "express";
import passport from "../config/passport.js";
import {
  registerUser,
  loginUser,
  homeRedirect,
  logoutUser,
  googleCallBack,
} from "../controllers/authControllers.js";
import TaskInputError from "../utils/TaskInputError.js";

const authRouter = express.Router();

export const ensureAuthenticated = (req, res, next) => {
  if (!req.user) {
    throw new TaskInputError("Unauthorized access, Please log in.", 401);
  }
  next();
};


authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser); 
authRouter.get("/home", homeRedirect);
authRouter.get("/logout", logoutUser);
authRouter.get("/google/callback", googleCallBack);

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  }),
);

export { authRouter };
