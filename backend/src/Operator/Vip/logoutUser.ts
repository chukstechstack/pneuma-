import LoginError from "@Toolkits/Login/loginError.js";
import { NextFunction, Request, Response } from "express";

export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
  // Passport adds the logout method to Express Request automatically when configured
  req.logout((err) => {
    if (err) {
      return next(new LoginError("log out failed", 500));
    }

    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        return next(destroyErr);
      }
      
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "logged out successfully" });
    });
  });
};