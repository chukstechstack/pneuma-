import pool from "@/Terminal/Supabase/supabaseConfig.js";

interface FeedItemRow {
  id: number | string;
  uuid: string;
  title: string | null;
  content: string | null;
  img: string | null;
  created_at: string | Date;
  likes_count: number;
  reposts_count: number;
  shares_count: number;
  author_name: string | null;
  avatar_url: string | null;
  author_profile_uuid: string;
  user_id: number | string;
  is_liked: boolean;
  is_reposted: boolean;
  relation_status: string | null;
  comments_count: number;
}

interface FetchGlobalTasksFeedResult {
  tasksFeed: FeedItemRow[];
  next_post_timestamp: number | null;
}

interface UserProfileIdRow {
  id: number | string;
}

export const fetchGlobalTasksFeed = async (
  user_uuid?: string | null,
  freeze_time?: string | number | null,
  fresh_load_pointer?: string | number | null
): Promise<FetchGlobalTasksFeedResult> => {
  let userId: number | string | null = null;


  if (user_uuid) {
    const user_Id_Res = await pool.query<UserProfileIdRow>("SELECT id FROM profiles WHERE uuid = $1", [user_uuid]);
    if (user_Id_Res.rows.length > 0) {
      userId = user_Id_Res.rows[0].id;
    }
  }


  const freezeTimeValue = (freeze_time && !isNaN(Number(freeze_time))) 
    ? Number(freeze_time) 
    : Date.now();
    
  const Freeze_Time_Date = new Date(freezeTimeValue);
  const queryParams: (string | number | Date | null)[] = [userId, Freeze_Time_Date];


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


  if (fresh_load_pointer && fresh_load_pointer !== 'Yes_Is_FreshLoad' && !isNaN(Number(fresh_load_pointer))) {
    const last_post_creation_date = new Date(Number(fresh_load_pointer));
    queryText += ` AND c.created_at < $3 `;
    queryParams.push(last_post_creation_date);
  }

  
  queryText += ` ORDER BY c.created_at DESC LIMIT 40`;

  const result = await pool.query<FeedItemRow>(queryText, queryParams);
  const tasksFeed = result.rows;

  let next_post_timestamp: number | null = null;
  if (tasksFeed.length === 40) {
    const lastItem = tasksFeed[tasksFeed.length - 1];
    next_post_timestamp = new Date(lastItem.created_at).getTime();
  }

  return {
    tasksFeed,
    next_post_timestamp
  };
};