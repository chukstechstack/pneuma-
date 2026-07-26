import passport from "passport";

import { findUserById } from "../../Workshop/Vip/passportService.js";
import { initLocalStrategy } from "./localPassport.js";
import { initGoogleStrategy } from "./googlePassport.js";

// ------- SERIALIZE/DESERIALIZE-USER---------

passport.serializeUser((user, done) => {
    console.log("Serializing user:", user);
    done(null, (user as any).uuid)
});

passport.deserializeUser(async (uuid, done) => {
    try {
        console.log("Deserializing user ID:", uuid);
        if (typeof uuid !== "string") {
            console.error("Invalid user ID type:", typeof uuid);
            return done(new Error("Invalid user ID type"));
        }

        const user = await findUserById(uuid);

        if (!user) {
            console.log("No user found for ID:", uuid);
            return done(null, false);
        }

        console.log("Deserialized user successfully:", user.uuid);
       return  done(null, user);
    } catch (err) {
        console.error("Error in deserializeUser:", err);
        return done(err);
    }
});

// ------- INITIALIZE ISOLATED STRATEGIES ---------

initLocalStrategy(passport);
initGoogleStrategy(passport);

export default passport;
