import pool from "@/Terminal/Supabase/supabaseConfig";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
  };
}

interface PendingRequestRow {
  requested_User_Uuid: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
}

interface PendingRequestsResponseData {
  requests: PendingRequestRow[];
}

export const getPendingRequests = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const authorProfileId = req.user?.id;

  if (!authorProfileId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const query = `
      SELECT 
        p.uuid AS "requested_User_Uuid", 
        p.first_name AS "firstName", 
        p.last_name AS "lastName", 
        p.avatar_url AS "avatarUrl"
      FROM follows f
      JOIN profiles p ON f.follower_id = p.id
      WHERE f.following_id = $1 
      AND f.status = 'pending'
    `;

    const { rows } = await pool.query<PendingRequestRow>(query, [authorProfileId]);

    const responseData: PendingRequestsResponseData = { requests: rows };
    return res.status(200).json(responseData);
    
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Error fetching pending requests:", errorMessage);
    return res.status(500).json({ message: "Internal server error" });
  }
};