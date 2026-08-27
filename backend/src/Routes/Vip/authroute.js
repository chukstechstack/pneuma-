import express from "express";
import { ensureAuthenticated } from "@/CheckPoint/Vip/authMiddleware.js";
import { registerUser } from "@/Operator/Vip/registerUser.js";
import { loginUser } from "@/Operator/Vip/loginUser.js";
import { logoutUser } from "@/Operator/Vip/logoutUser.js";
import { googleCallBack } from "@/Operator/Vip/googleCallback.js";
import { googleLogin } from "@/Operator/Vip/googleLogin.js";
import { forgotPassword } from "../../Operator/Vip/forgot-password";
const authRoute = express.Router();
authRoute.post("/register", registerUser);
authRoute.post("/login", loginUser);
authRoute.post("/forgot-password", forgotPassword);
authRoute.post("/logout", logoutUser);
authRoute.get("/google/callback", googleCallBack);
authRoute.get("/me", ensureAuthenticated, (req, res) => {
    const authenticatedReq = req;
    return res.json({
        id: authenticatedReq.user?.id,
        uuid: authenticatedReq.user?.uuid,
    });
});
authRoute.get("/google", googleLogin);
export default authRoute;
//# sourceMappingURL=authroute.js.map