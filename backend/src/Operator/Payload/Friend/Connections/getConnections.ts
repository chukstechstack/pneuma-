import { Request, Response } from 'express';
import pool from '../../../../Terminal/Supabase/supabaseConfig';

interface TargetProfileParams {
    targetProfileUuid?: string;
}

interface ConnectionProfile {
    uuid: string;
    full_name: string | null;
    avatar_url: string | null;
}

interface GetConnectionsSuccessResponse {
    success: true;
    connections: ConnectionProfile[];
}

interface GetConnectionsErrorResponse {
    error: string;
}

type GetConnectionsResponse = GetConnectionsSuccessResponse | GetConnectionsErrorResponse;

export const getConnections = async (
    req: Request<TargetProfileParams>,
    res: Response<GetConnectionsResponse>
) => {
    try {
        const { targetProfileUuid } = req.params;

        if (!targetProfileUuid) {
            return res.status(400).json({ error: "Target profile UUID is required." });
        }

        /* 
          SQL Query: 
          Fetches profiles of users that the target user is connected to/following.
          (Assumes your table is named 'connections' or 'follows' with columns like 'follower_uuid' / 'following_uuid' 
          or 'user_uuid' / 'connected_user_uuid'. Adjust column names to match your exact schema!)
        */
        const query = `
      SELECT p.uuid, p.full_name, p.avatar_url
      FROM connections c
      JOIN profiles p ON p.uuid = c.connected_user_uuid
      WHERE c.user_uuid = $1
    `;

        const { rows } = await pool.query<ConnectionProfile>(query, [targetProfileUuid]);

        return res.status(200).json({
            success: true,
            connections: rows,
        });
    } catch (error) {
        console.error("Error fetching connections:", error);
        return res.status(500).json({ error: "Internal server error while fetching connections." });
    }
};