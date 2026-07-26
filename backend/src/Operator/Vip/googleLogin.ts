import { NextFunction, Request, Response } from "express";
import passport from "passport";

export const googleLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
};
