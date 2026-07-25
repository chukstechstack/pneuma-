import express, { type Request, type Response } from "express";
import { registerUser } from "@/Operator/Vip/registerUser";
import { loginUser } from "@/Operator/Vip/loginUser";
import { logoutUser } from "@/Operator/Vip/logoutUser";
import { googleCallBack } from "@/Operator/Vip/googleCallback";
import { googleLogin } from "@/Operator/Vip/googleLogin";

import { ensureAuthenticated } from "@/CheckPoint/Vip/authMiddleware";

const authRoute = express.Router();

authRoute.post("/register", registerUser);
authRoute.post("/login", loginUser);
authRoute.post("/logout", logoutUser);
authRoute.get("/google/callback", googleCallBack);

authRoute.get(
  "/me",
  ensureAuthenticated,
  (req: Request & { user?: { id?: string; uuid?: string } }, res: Response) => {
    return res.json({
      id: req.user?.id,
      uuid: req.user?.uuid
    });
  }
);

authRoute.get("/google", googleLogin);

export default authRoute;