import express from "express";
import { ensureAuthenticated } from "@/CheckPoint/Vip/authMiddleware";

import { registerUser } from "@/Operator/Vip/registerUser";
import { loginUser } from "@/Operator/Vip/loginUser";
import { logoutUser } from "@/Operator/Vip/logoutUser";
import { googleCallBack } from "@/Operator/Vip/googleCallback";
import { googleLogin } from "@/Operator/Vip/googleLogin";

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