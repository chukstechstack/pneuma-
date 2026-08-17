import pool from "@/Terminal/Supabase/supabaseConfig.js";
import { TaskItem } from "@shared/types";

export interface FetchGlobalTasksFeedResult {
  tasksFeed: TaskItem[];
  next_post_timestamp: number | null;
}

interface UserProfileIdRow {
  id: number | string;
}

export const fetchGlobalTasksFeed = async (
  user_uuid?: string | null,
  fresh_load_pointer?: string | number | null
): Promise<FetchGlobalTasksFeedResult> => {
  let userId: number | string | null = null;

  if (user_uuid) {
    const user_Id_Res = await pool.query<UserProfileIdRow>("SELECT id FROM profiles WHERE uuid = $1", [user_uuid]);
    if (user_Id_Res.rows.length > 0) {
      userId = user_Id_Res.rows[0].id;
    }
    console.log("Resolved User ID:", userId);
  }

  const queryParams: (string | number | Date | null)[] = [userId];

  let queryText = `
    SELECT 
      c.*,
      CONCAT(p.first_name, ' ', p.last_name) AS author_name, 
      p.avatar_url,
      p.uuid AS author_profile_uuid, 

      EXISTS (
        SELECT 1 FROM interactions 
        WHERE content_id = c.id AND user_id = $1 AND interaction_type = 'like'
      ) AS is_liked,
      
      EXISTS (
        SELECT 1 FROM interactions 
        WHERE content_id = c.id AND user_id = $1 AND interaction_type = 'repost'
      ) AS is_reposted,
      
      (
        SELECT status FROM follows 
        WHERE follower_id = $1 AND following_id = c.user_id
        LIMIT 1
      ) AS relation_status,
      
      (
        SELECT COUNT(*)::INT FROM comments 
        WHERE content_id = c.id
      ) AS comments_count
       
    FROM content c 
    LEFT JOIN profiles p ON c.user_id = p.id 
    WHERE c.created_at <= NOW()`;

  if (fresh_load_pointer && fresh_load_pointer !== 'Yes_Is_FreshLoad' && !isNaN(Number(fresh_load_pointer))) {
    const last_post_creation_date = new Date(Number(fresh_load_pointer));
    queryText += ` AND c.created_at < $2 `;
    queryParams.push(last_post_creation_date);
  }

  queryText += ` ORDER BY c.created_at DESC LIMIT 40`;

  console.log("🛠️ --- EXECUTING Journal FEED QUERY ---");
  console.log("Parameter for Journal Feeds [userId, pagination]:", queryParams);

  const result = await pool.query<TaskItem>(queryText, queryParams);
  const tasksFeed = result.rows;

  console.log(`📌 Rows returned from PostgreSQL Journal Feed: ${tasksFeed.length}`);

  let next_post_timestamp: number | null = null;
  if (tasksFeed.length === 40) {
    next_post_timestamp = new Date(tasksFeed[tasksFeed.length - 1].created_at).getTime();
  }

  return {
    tasksFeed,
    next_post_timestamp
  };
};