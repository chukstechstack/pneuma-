import RegistrationError from "../utils/RegistrationError.js";
import bcryptjs from "bcryptjs";
import {
  findUserRegistration,
  registerNewUser,
} from "../services/auth/authService.js";
import LoginError from "../utils/LoginError.js";
import passport from "passport";

const saltRound = 10;

const registerUser = async (req, res, next) => {
  let {
    username,
    password,
    first_name,
    last_name,
    country,
    email,
    google_id,
    avatar_url,
  } = req.body;

  username = username?.trim();
  password = password?.trim();
  first_name = first_name?.trim();
  last_name = last_name?.trim();
  country = country?.trim();
  email = email?.trim();
  google_id = google_id?.trim();
  avatar_url = avatar_url?.trim();

  try {
    if (!username) throw new RegistrationError("username is required", 400);
    if (!password) throw new RegistrationError("Password is required", 400);
    if (!first_name) throw new RegistrationError("First name is required", 400);
    if (!last_name) throw new RegistrationError("Last name is required", 400);
    if (!country) throw new RegistrationError("country is required", 400);
    if (!email) throw new RegistrationError("Email is required", 400);

    // const userCountry = country || "unknown"
    const user = await findUserRegistration(email);
    if (user) {
      return res.status(400).json({ message: "user already exisit" });
    }

    const hash = await bcryptjs.hash(password, saltRound);

    const newUser = await registerNewUser({
      username,
      password: hash,
      first_name,
      last_name,
      country,
      email,
      google_id,
      avatar_url,
    });

    console.log(req.body);

    req.login(newUser, (err) => {
      if (err) {
        return res.status(400).json(err.message);
      }

      return res.status(201).json({
        message: "user registered successfully",
      });
    });
  } catch (err) {
    if (err.code === "23505") {
      return next(new AppError("Email already exisits", 400));
    }
    next(err);
  }
};

const loginUser =
  ("/login",
    (req, res, next) => {
      passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);

        if (!user) throw new LoginError("user not found Register!!");

        req.login(user, (err) => {
          if (err) throw new LoginError("login failed");
          return res.json({
            message: "Login successful",
          });
        });
      })(req, res, next);
    });

const logoutUser =
  ("/logout",
    (req, res, next) => {
      req.logout((err) => {
        if (err) throw new LoginError("log out failed", 500);

        req.session.destroy((err) => {
          if (err) return next(err);
        });

        res.clearCookie("connect.sid");
        res.json({ message: "logged out successfully" });
      });
    });

const googleCallBack = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("http://localhost:5173/auth/login");
    req.login(user, (err) => {
      if (err)
        return next(new LoginError("session creation failed", 500));
      return res.redirect("http://localhost:5173/taskhome/home");
    });
  })(req, res, next);
};

export { registerUser, loginUser, logoutUser, googleCallBack };
