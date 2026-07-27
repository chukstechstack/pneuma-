import express from "express";
import { ensureAuthenticated } from "@/CheckPoint/Vip/authMiddleware.js";

import { registerUser } from "@/Operator/Vip/registerUser.js";
import { loginUser } from "@/Operator/Vip/loginUser.js";
import { logoutUser } from "@/Operator/Vip/logoutUser.js";
import { googleCallBack } from "@/Operator/Vip/googleCallback.js";
import { googleLogin } from "@/Operator/Vip/googleLogin.js";


const authRoute = express.Router();

interface EmptyParams {
  [key: string]: string;
}

interface AuthenticatedRequest extends express.Request<EmptyParams> {
  user?: {
    id: string;
    uuid: string;
  };
}
authRoute.post<EmptyParams>("/register", registerUser as express.RequestHandler<EmptyParams>);
authRoute.post<EmptyParams>("/login", loginUser as express.RequestHandler<EmptyParams>);

authRoute.post<EmptyParams>("/logout", logoutUser);
authRoute.get<EmptyParams>("/google/callback", googleCallBack);

authRoute.get<EmptyParams>(
  "/me",
  ensureAuthenticated,
  (req, res) => {
    const authenticatedReq = req as AuthenticatedRequest;
    return res.json({
      id: authenticatedReq.user?.id,
      uuid: authenticatedReq.user?.uuid,
    });
  }
);

authRoute.get<EmptyParams>("/google", googleLogin);

export default authRoute;