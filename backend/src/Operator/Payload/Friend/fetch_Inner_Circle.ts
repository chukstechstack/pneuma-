import pool from "@/Terminal/Supabase/supabaseConfig";
import type { Request, Response } from "express";
import type { PoolClient } from "pg";

interface FetchEngagementRequestParams {
  targetProfileUuid: string;
}

interface AuthenticatedRequest extends Request<FetchEngagementRequestParams> {
  user?: {
    id?: string | number;
  };
}

interface ProfileRow {
  id: number | string;
  uuid: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

interface EngagementResponseData {
  list: ProfileRow[];
}

export const fetchEngagementDetails = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { targetProfileUuid } = req.params;
    let targetId: string | number | undefined;

    if (targetProfileUuid === 'me') {
      targetId = req.user?.id;
      if (!targetId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      const targetUser = await pool.query<ProfileRow>(
        "SELECT id FROM profiles WHERE uuid = $1", 
        [targetProfileUuid]
      );
      if (targetUser.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      targetId = targetUser.rows[0].id;
    }

    const connections = await pool.query<ProfileRow>(`
      SELECT DISTINCT p.uuid, p.username, p.first_name, p.last_name, p.avatar_url
      FROM profiles p
      JOIN follows f ON (p.id = f.follower_id OR p.id = f.following_id)
      WHERE (f.follower_id = $1 OR f.following_id = $1)
      AND f.status = 'active'
      AND p.id != $1
      LIMIT 15`, 
      [targetId]
    );

    const responseData: EngagementResponseData = {
      list: connections.rows
    };

    return res.json(responseData);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(errorMessage);
    const message = `server error +${errorMessage}`;
    return res.status(500).json({ error: message });
  }
};