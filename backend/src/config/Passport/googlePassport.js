import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import crypto from "crypto";
import dotenv from "dotenv";
import {
  findUserByGoogle_id,
  findGoogleUserByEmail,
  updateGoogleIdByEmail,
  insertGoogleUser,
} from "../../services/Auth/passportService.js";

dotenv.config();

export const initGoogleStrategy = (passport) => {
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
          
          console.log("Processing Google Profile for ID:", google_id);
          
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

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
