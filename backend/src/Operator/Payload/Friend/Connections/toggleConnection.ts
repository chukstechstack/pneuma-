import pool from "../../../../Terminal/Supabase/supabaseConfig";
import { Request, Response } from "express";

interface ToggleConnectionParams {
    targetProfileUuid: string;
}

interface AuthenticatedUser {
    uuid?: string;
    id?: string;
}

interface ConnectionRow {
    connector_uuid: string;
    connected_uuid: string;
    created_at?: string;
}

export const toggleConnection = async (
    req: Request<ToggleConnectionParams, any, any, any> & { user?: AuthenticatedUser },
    res: Response
) => {
    try {
        const user = req.user as AuthenticatedUser | undefined;
        const currentUserUuid = user?.uuid || user?.id;
        const { targetProfileUuid } = req.params;

        if (!targetProfileUuid) {
            return res.status(400).json({ error: "Target profile UUID is required." });
        }

        if (currentUserUuid === targetProfileUuid) {
            return res.status(400).json({ error: "You cannot connect with yourself." });
        }

        // 1. Look up the integer profile IDs for both users using their UUIDs
        const currentUserQuery = await pool.query(`SELECT id FROM profiles WHERE uuid = $1`, [currentUserUuid]);
        const targetUserQuery = await pool.query(`SELECT id FROM profiles WHERE uuid = $1`, [targetProfileUuid]);

        const currentProfileId = currentUserQuery.rows[0]?.id;
        const targetProfileId = targetUserQuery.rows[0]?.id;

        if (!currentProfileId || !targetProfileId) {
            return res.status(404).json({ error: "One or both user profiles could not be found." });
        }

        // 2. Check if a connection already exists using UUIDs
        const checkQuery = `
            SELECT * FROM connections 
            WHERE connector_uuid = $1 AND connected_uuid = $2
        `;
        const existingConnection = await pool.query(checkQuery, [currentUserUuid, targetProfileUuid]) as { rows: ConnectionRow[] };

        if (existingConnection.rows.length > 0) {
            // 3. If it exists, delete it (Disconnect)
            const deleteQuery = `
                DELETE FROM connections 
                WHERE connector_uuid = $1 AND connected_uuid = $2
            `;
            await pool.query(deleteQuery, [currentUserUuid, targetProfileUuid]);

            return res.status(200).json({
                success: true,
                isConnected: false,
                message: "Successfully disconnected.",
            });
        } else {
            // 4. If it doesn't exist, insert both integer IDs and UUIDs (Connect)
            const insertQuery = `
                INSERT INTO connections (connector_id, connected_id, connector_uuid, connected_uuid, created_at)
                VALUES ($1, $2, $3, $4, NOW())
            `;
            await pool.query(insertQuery, [currentProfileId, targetProfileId, currentUserUuid, targetProfileUuid]);

            return res.status(200).json({
                success: true,
                isConnected: true,
                message: "Successfully connected.",
            });
        }
    } catch (error) {
        console.error("Error toggling connection:", error);
        return res.status(500).json({ error: "Internal server error while toggling connection." });
    }
};