import pool from '../../../../Terminal/Supabase/supabaseConfig';
export const getConnections = async (req, res) => {
    try {
        const { targetProfileUuid } = req.params;
        if (!targetProfileUuid) {
            return res.status(400).json({ error: "Target profile UUID is required." });
        }
        /*
          Query to fetch all profiles connected to or from the target user.
          This maps bi-directional connections so nothing gets missed.
        */
        const query = `
            SELECT DISTINCT p.uuid, p.full_name, p.avatar_url
            FROM connections c
            JOIN profiles p ON (
                (c.connector_uuid = $1 AND p.uuid = c.connected_uuid) OR 
                (c.connected_uuid = $1 AND p.uuid = c.connector_uuid)
            )
            WHERE c.connector_uuid = $1 OR c.connected_uuid = $1;
        `;
        const { rows } = await pool.query(query, [targetProfileUuid]);
        return res.status(200).json({
            success: true,
            connections: rows,
            connection_count: rows.length,
        });
    }
    catch (error) {
        console.error("Error fetching connections:", error);
        return res.status(500).json({ error: "Internal server error while fetching connections." });
    }
};
//# sourceMappingURL=getConnections.js.map