import pool from "@/Terminal/Supabase/supabaseConfig.js";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
const scrypt = promisify(_scrypt);
export const updateProfileController = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { full_name, bio, email, password } = req.body;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        // 1. Check if email is already taken by another account
        if (email) {
            const emailCheck = await pool.query(`SELECT id FROM profiles WHERE email = $1 AND id != $2`, [email, userId]);
            if (emailCheck.rows.length > 0) {
                return res.status(400).json({ error: "Email is already in use by another account." });
            }
        }
        // 2. Handle password hashing using native crypto
        let hashedPassword = null;
        if (password && typeof password === "string" && password.trim() !== "") {
            const salt = randomBytes(16).toString("hex");
            const derivedKey = (await scrypt(password, salt, 64));
            hashedPassword = `${salt}:${derivedKey.toString("hex")}`;
        }
        // 3. Update the profiles table dynamically
        const updateRes = await pool.query(`UPDATE profiles 
       SET full_name = COALESCE($1, full_name), 
           bio = COALESCE($2, bio),
           email = COALESCE($3, email),
           password = COALESCE($4, password)
       WHERE id = $5 
       RETURNING id, uuid, username, full_name, email, avatar_url, bio, created_at`, [full_name || null, bio || null, email || null, hashedPassword, userId]);
        if (updateRes.rows.length === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }
        const updatedProfile = updateRes.rows[0];
        // 4. 🔌 Emit Socket Event using your server's "socketio" app setting
        const io = req.app.get("socketio");
        if (io) {
            // Broadcasts to all connected clients so any task card or feed viewing this user updates instantly
            io.emit("server:profile_updated", {
                userUuid: updatedProfile.uuid,
                profile: updatedProfile,
            });
        }
        return res.status(200).json({
            message: "Profile details updated successfully",
            profile: updatedProfile,
        });
    }
    catch (error) {
        console.error("Error updating profile details:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
//# sourceMappingURL=edit_Profile.js.map