import bcryptjs from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import dotenv from "dotenv";
import crypto from "crypto";
import {
  findUserByEmail,
  findUserById,
  findGoogleUserByEmail,
  findUserByGoogle_id,
  insertGoogleUser,
  updateGoogleIdByEmail,
} from "../services/auth/passportService.js";
import LoginError from "../utils/LoginError.js";

dotenv.config();

// ------- LOCAL-STRATEGY ---------
passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        if (!email) throw new LoginError("email required", 400);
        if (!password) throw new LoginError("password required");
        const user = await findUserByEmail(email);

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const isValid = await bcryptjs.compare(password, user.password);
        if (isValid) {
          delete user.password;
          return done(null, user);
        } else {
          return done(null, false, { message: "incorrect Password" });
        }
      } catch (err) {
        return done(err);
      }
    },
  ),
);

// ------- SERIALIZE/DESERIALIZE-USER---------

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user.uuid);
});

passport.deserializeUser(async (uuid, done) => {
  try {
    console.log("Deserializing user id:", uuid);

    const user = await findUserById(uuid);

    if (!user) {
      console.log("No user found for id:", uuid);
      return done(null, false);
    }

    console.log("Deserialized user:", user);

    // Attach the user object to req.user
    done(null, user);
  } catch (err) {
    console.error("Error in deserializeUser:", err);
    return done(err, null, { message: "error deserializing User" });
  }
});

// ------- GOOGLE STRATEGY  ---------

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const google_id = profile.id;
        const [first_name, last_name] = profile.displayName.split(" ");
        console.log(profile);
        let user = await findUserByGoogle_id(google_id);
        if (!user) {
          user = await findGoogleUserByEmail(email);
          if (user) {
            user = await updateGoogleIdByEmail(google_id, email);
          } else {
            const baseUsername = email.split("@")[0];
            const uniqueSuffix = crypto.randomBytes(3).toString("hex");
            const username = `${baseUsername}_${uniqueSuffix}`;

            user = await insertGoogleUser({
              username,
              first_name,
              last_name,
              email,
              google_id,
            });
          }
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);

export default passport;
