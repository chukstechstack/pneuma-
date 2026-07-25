import LoginError from "../../../utils/loginError.js";

export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(new LoginError("log out failed", 500));

    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      return res.json({ message: "logged out successfully" });
    });
  });
};
