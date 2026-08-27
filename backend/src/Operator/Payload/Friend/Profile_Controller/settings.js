import pool from "@/Terminal/Supabase/supabaseConfig.js";
// GET /api/profile/settings - Fetches private account details for the owner
export const getProfileSettingsController = async (req, res) => {
    try {
        const userId = req.user?.id; // Adjust based on your auth middleware
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const result = await pool.query(`SELECT id, uuid, username, full_name, email, bio, avatar_url, created_at 
       FROM profiles WHERE id = $1`, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }
        return res.status(200).json({ settings: result.rows[0] });
    }
    catch (error) {
        console.error("Error fetching profile settings:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
//# sourceMappingURL=settings.js.map