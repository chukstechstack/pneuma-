import pool from "@/Terminal/Supabase/supabaseConfig.js";

export interface PendingRequestRow {
  requested_User_Uuid: string;
  full_name: string | null;
  avatarUrl: string | null;
}

export const fetchPendingRequestsQuery = async (
  authorProfileId: string | number
): Promise<PendingRequestRow[]> => {
  const query = `
    SELECT 
      p.uuid AS "requested_User_Uuid", 
      p.full_name,
      p.avatar_url AS "avatarUrl"
    FROM follows f
    JOIN profiles p ON f.follower_id = p.id
    WHERE f.following_id = $1 
    AND f.status = 'pending'
  `;

  const { rows } = await pool.query<PendingRequestRow>(query, [authorProfileId]);
  return rows;
};