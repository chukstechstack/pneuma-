import LoginError from "../../../utils/loginError.js";
import passport from "../../../config/passport/serialize_deserialize.js";

export const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return next(new LoginError(info?.message || "user not found Register!!", 404));

    req.login(user, (err) => {
      if (err) return next(err);

      // Explicitly wait until session database writes settle
      req.session.save((sessionErr) => {
        if (sessionErr) return next(sessionErr);
        return res.status(200).json({
          message: "logged in successfully",
          user: {
            id: user.id,
            uuid: user.uuid
          }
        });
      });
    });
  })(req, res, next); // ✅ Fixed syntax error here: correctly closed bracket and passed parameters
};
