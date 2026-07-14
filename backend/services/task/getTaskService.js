import pool from "../../config/supabaseConfig.js";

export const fetchGlobalTasksFeed = async (user_uuid, freeze_time, fresh_load_pointer) => {
  let userId = null;

  // 1. Look up user numeric ID safely
  if (user_uuid) {
    const user_Id_Res = await pool.query("SELECT id FROM profiles WHERE uuid = $1", [user_uuid]);
    if (user_Id_Res.rows.length > 0) {
      userId = user_Id_Res.rows[0].id;
    }
  }

  // 2. Setup snapshot baseline dates with fallback to current time
  const freezeTimeValue = (freeze_time && !isNaN(Number(freeze_time))) 
    ? Number(freeze_time) 
    : Date.now();
    
  const Freeze_Time_Date = new Date(freezeTimeValue);
  const queryParams = [userId, Freeze_Time_Date];

  // 3. Main Query String
  let queryText = `
    SELECT 
      c.id,
      c.uuid,
      c.title,
      c.content,
      c.img,
      c.created_at,
      c.likes_count,    
      c.reposts_count,  
      c.shares_count,   
      CONCAT(p.first_name, ' ', p.last_name) AS author_name, 
      p.avatar_url,
      p.uuid AS author_profile_uuid, 
      c.user_id,

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
     WHERE c.created_at <= $2 `;

  // 4. Anchor timestamp pointer check with safety validation
  if (fresh_load_pointer && fresh_load_pointer !== 'Yes_Is_FreshLoad' && !isNaN(Number(fresh_load_pointer))) {
    const last_post_creation_date = new Date(Number(fresh_load_pointer));
    queryText += ` AND c.created_at < $3 `;
    queryParams.push(last_post_creation_date);
  }

  // 5. Sorted strictly by time
  queryText += ` ORDER BY c.created_at DESC LIMIT 40`;

  const result = await pool.query(queryText, queryParams);
  const tasksFeed = result.rows;

  // 6. Calculate your next moving bookmark timestamp token
  let next_post_timestamp = null;
  if (tasksFeed.length === 40) {
    const lastItem = tasksFeed[tasksFeed.length - 1];
    next_post_timestamp = new Date(lastItem.created_at).getTime();
  }

  return {
    tasksFeed,
    next_post_timestamp
  };
};