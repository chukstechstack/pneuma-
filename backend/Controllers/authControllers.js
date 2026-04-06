import RegistrationError from "../utils/RegistrationError.js";
import bcryptjs from "bcryptjs";
import {
  findUserRegistration,
  registerNewUser,
} from "../services/authService.js";

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
      return res.status(400).json({ msg: "user already exisit" });
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

const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: "Login failed" });
      return res.json({
        message: "Login successful",
      });
    });
  })(req, res, next);
};

const homeRedirect = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({ user: req.user });
};

const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);
    });

    res.clearCookie("connect.sid");
    res.json({ message: "logged out successfully" });
  });
};

const googleCallBack = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/auth/login");

    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect("/auth/home");
    });
  })(req, res, next);
};

export { registerUser, loginUser, homeRedirect, logoutUser, googleCallBack };
