import LoginError from "@Toolkits/Login/loginError";
import { NextFunction, Request, Response } from "express";

type LogoutRequest = Request & {
  logout: (callback: (err: any) => void) => void;
};

export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
  const logoutReq = req as LogoutRequest;

  logoutReq.logout((err) => {
    if (err) return next(new LoginError("log out failed", 500));

    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      return res.json({ message: "logged out successfully" });
    });
  });
};
