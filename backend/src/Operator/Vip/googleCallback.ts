import { Request, Response, NextFunction } from "express";
import LoginError from "@Toolkits/Login/loginError";
import passport from "passport";

export const googleCallBack = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) return res.redirect("https://pneuma-frontend-oijl.onrender.com/login");
    
    req.login(user, (err: any) => {
      if (err) return next(new LoginError("session creation failed", 500));
      return res.redirect("https://pneuma-frontend-oijl.onrender.com/home");
    });
  })(req, res, next);
};
