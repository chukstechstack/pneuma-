import pool from "@/Terminal/Supabase/supabaseConfig";

export interface PendingRequestRow {
  requested_User_Uuid: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
}

export const fetchPendingRequestsQuery = async (
  authorProfileId: string | number
): Promise<PendingRequestRow[]> => {
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
  return rows;
};