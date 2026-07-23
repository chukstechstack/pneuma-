import express from "express";
import { registerUser } from "../../controllers/auth/registerUser.js";
import { loginUser } from "../../controllers/auth/loginUser.js";
import { logoutUser } from "../../controllers/auth/logoutUser.js";
import { googleCallBack } from "../../controllers/auth/googleCallback.js";
import { googleLogin } from "../../controllers/auth/googleLogin.js";

import { ensureAuthenticated } from "../../middleware/authMiddleware.js";

const authRoute = express.Router();

authRoute.post("/register", registerUser);
authRoute.post("/login", loginUser);
authRoute.post("/logout", logoutUser);
authRoute.get("/google/callback", googleCallBack);

authRoute.get("/me", ensureAuthenticated, (req, res) => {

    res.json({
        id: req.user.id,
        uuid: req.user.uuid
    });
});

authRoute.get("/google", googleLogin);

export default authRoute;
