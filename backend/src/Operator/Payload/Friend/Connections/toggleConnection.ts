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
    user_uuid: string;
    connected_user_uuid: string;
    created_at?: string;
}

export const toggleConnection = async (
    req: Request<ToggleConnectionParams, any, any, any> & { user?: AuthenticatedUser },
    res: Response
) => {
    try {
        // req.user contains the authenticated user's info set by ensureAuthenticated middleware
        const user = req.user as AuthenticatedUser | undefined;
        const currentUserUuid = user?.uuid || user?.id;
        const { targetProfileUuid } = req.params;

        if (!targetProfileUuid) {
            return res.status(400).json({ error: "Target profile UUID is required." });
        }

        if (currentUserUuid === targetProfileUuid) {
            return res.status(400).json({ error: "You cannot connect with yourself." });
        }

        // 1. Check if a connection already exists
        const checkQuery = `
      SELECT * FROM connections 
      WHERE user_uuid = $1 AND connected_user_uuid = $2
    `;
        const existingConnection = await pool.query(checkQuery, [currentUserUuid, targetProfileUuid]) as { rows: ConnectionRow[] };

        if (existingConnection.rows.length > 0) {
            // 2. If it exists, delete it (Disconnect)
            const deleteQuery = `
        DELETE FROM connections 
        WHERE user_uuid = $1 AND connected_user_uuid = $2
      `;
            await pool.query(deleteQuery, [currentUserUuid, targetProfileUuid]);

            return res.status(200).json({
                success: true,
                isConnected: false,
                message: "Successfully disconnected.",
            });
        } else {
            // 3. If it doesn't exist, insert it (Connect)
            const insertQuery = `
        INSERT INTO connections (user_uuid, connected_user_uuid, created_at)
        VALUES ($1, $2, NOW())
      `;
            await pool.query(insertQuery, [currentUserUuid, targetProfileUuid]);

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