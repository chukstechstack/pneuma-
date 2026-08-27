import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import crypto from "crypto";
import dotenv from "dotenv";
import { findUserByGoogle_id, findGoogleUserByEmail, updateGoogleIdByEmail, insertGoogleUser, } from "@Workshop/Vip/passportService.js";
dotenv.config();
const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackURL = process.env.GOOGLE_CALLBACK_URL;
if (!googleClientID || !googleClientSecret || !googleCallbackURL) {
    throw new Error("Missing Google OAuth environment variables");
}
export const initGoogleStrategy = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackURL,
    }, async (_accessToken, _refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value;
            const google_id = profile.id;
            const full_name = profile.displayName; // Use full displayName directly
            if (!email) {
                return done(new Error("Email not found in Google profile"));
            }
            console.log("Processing Google Profile for ID:", google_id);
            let user = await findUserByGoogle_id(google_id);
            if (!user) {
                user = await findGoogleUserByEmail(email);
                if (user) {
                    user = await updateGoogleIdByEmail(google_id, email);
                }
                else {
                    const baseUsername = email.split("@")[0];
                    const uniqueSuffix = crypto.randomBytes(3).toString("hex");
                    const username = `${baseUsername}_${uniqueSuffix}`;
                    user = await insertGoogleUser({
                        username,
                        full_name, // Pass full_name here
                        email,
                        google_id,
                    });
                }
            }
            return done(null, user);
        }
        catch (err) {
            return done(err);
        }
    }));
};
//# sourceMappingURL=googlePassport.js.map