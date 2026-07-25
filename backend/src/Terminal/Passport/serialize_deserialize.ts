import passport from "passport";

import { findUserById } from "../../Workshop/Vip/passportService.js";
import { initLocalStrategy } from "./localPassport.js";
import { initGoogleStrategy } from "./googlePassport.js";

// ------- SERIALIZE/DESERIALIZE-USER---------

passport.serializeUser((user, done) => {
    console.log("Serializing user:", user);
    done(null, user.uuid); // Store ONLY the uuid in the session cookie
});

passport.deserializeUser(async (uuid, done) => {
    try {
        console.log("Deserializing user ID:", uuid);
        const user = await findUserById(uuid);

        if (!user) {
            console.log("No user found for ID:", uuid);
            return done(null, false, { message: "User account no longer exists." });
        }

        console.log("Deserialized user successfully:", user.uuid);
       return  done(null, user); // Attaches profile data directly to req.user
    } catch (err) {
        console.error("Error in deserializeUser:", err);
        return done(err, null, { message: "error deserializing User" });
    }
});

// ------- INITIALIZE ISOLATED STRATEGIES ---------

initLocalStrategy(passport);
initGoogleStrategy(passport);

export default passport;
