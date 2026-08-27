import LoginError from "@Toolkits/Login/loginError.js";
import passport from "passport";
export const googleCallBack = (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
        if (err)
            return next(err);
        if (!user)
            return res.redirect("https://pneuma-frontend-oijl.onrender.com/login");
        req.login(user, (err) => {
            if (err)
                return next(new LoginError("session creation failed", 500));
            return res.redirect("https://pneuma-frontend-oijl.onrender.com/home");
        });
    })(req, res, next);
};
//# sourceMappingURL=googleCallback.js.map