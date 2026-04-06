import bcryptjs from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import dotenv from "dotenv";
import crypto from "crypto";
import {
  findUserByEmail,
  findUserById,
  findGoogleByEmail,
  insertGoogleUser,
} from "../services/passportService.js";


dotenv.config();

// ------- LOCAL-STRATEGY ---------
passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
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
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log("Deserializing user id:", id);

    const user = await findUserById(id);

    if (!user) {
      console.log("No user found for id:", id);
      return done(null, false);
    }

    console.log("Deserialized user:", user);

    // Attach the user object to req.user
    done(null, user);
  } catch (err) {
    console.error("Error in deserializeUser:", err);
    return done(err, null);
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

        let user = await findGoogleByEmail(email);

        if (!user) {
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

        done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);

export default passport;
