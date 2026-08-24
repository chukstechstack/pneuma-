import pool from "@/Terminal/Supabase/supabaseConfig.js";
import { TaskItem } from "@shared/types";

export interface FetchGlobalTasksFeedResult {
  tasksFeed: TaskItem[];
  next_post_timestamp: number | null;
}

export const fetchGlobalTasksFeed = async (
  currentUserUuid?: string | null,
  fresh_load_pointer?: string | number | null
): Promise<FetchGlobalTasksFeedResult> => {
  
  const queryParams: (string | number | Date | null)[] = [];
  let paramIndex = 1;

  // 1. Push currentUserUuid as the first parameter if it exists, otherwise use null
  queryParams.push(currentUserUuid || null);
  const currentUserUuidParamIndex = paramIndex++; // This will be $1

  let queryText = `
    SELECT 
      c.*,
      p.full_name AS author_name,
      p.avatar_url AS author_avatar_url,
      p.uuid AS author_profile_uuid, 
      FALSE AS is_liked,
      FALSE AS is_reposted,
      -- Plain and simple check: if con.connector_uuid is not null, then true, else false
      (con.connector_uuid IS NOT NULL) AS is_connected
    FROM content c 
    LEFT JOIN profiles p ON c.user_id = p.id 
    LEFT JOIN connections con 
      ON con.connector_uuid = $${currentUserUuidParamIndex}::uuid 
      AND con.connected_uuid = p.uuid
    WHERE c.created_at <= NOW()`;

  // 2. Handle pagination pointer if it exists
  if (fresh_load_pointer && fresh_load_pointer !== 'Yes_Is_FreshLoad' && !isNaN(Number(fresh_load_pointer))) {
    const last_post_creation_date = new Date(Number(fresh_load_pointer));
    queryParams.push(last_post_creation_date);
    queryText += ` AND c.created_at < $${paramIndex++} `;
  }

  queryText += ` ORDER BY c.created_at DESC LIMIT 40`;

  console.log("🛠️ --- EXECUTING Global Tasks FEED QUERY ---");
  console.log("Parameters for Global Feeds:", queryParams);

  const result = await pool.query<TaskItem>(queryText, queryParams);
  const tasksFeed = result.rows;

  console.log(`📌 Rows returned from PostgreSQL Global Feed: ${tasksFeed.length}`);

  let next_post_timestamp: number | null = null;
  if (tasksFeed.length === 40) {
    next_post_timestamp = new Date(tasksFeed[tasksFeed.length - 1].created_at).getTime();
  }

  return {
    tasksFeed,
    next_post_timestamp
  };
};