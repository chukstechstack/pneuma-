import pool from "@/Terminal/Supabase/supabaseConfig.js";
export const getTaskProfileController = async (req, res) => {
    try {
        // Look for targetProfileUuid first (from the route param), falling back to session user if needed
        const userUuid = req.params.targetProfileUuid || req.user?.uuid || req.user?.id;
        if (!userUuid || typeof userUuid !== "string") {
            return res.status(400).json({ error: "A valid user UUID string is required." });
        }
        const query = `
            SELECT uuid, username, full_name, avatar_url, bio, created_at 
            FROM profiles 
            WHERE uuid = $1
        `;
        const result = await pool.query(query, [userUuid]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Profile not found." });
        }
        return res.status(200).json({
            success: true,
            profile: result.rows[0],
        });
    }
    catch (error) {
        console.error("Error fetching task profile snapshot:", error);
        return res.status(500).json({ error: "Internal server error while fetching profile." });
    }
};
//# sourceMappingURL=getTaskProfile.js.map