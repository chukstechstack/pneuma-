import pool from "@/Terminal/Supabase/supabaseConfig.js";

interface JournalFeedItemRow {
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
  is_repost_badge: boolean;
  reposted_by_name: string | null;
  comments_count: number;
  is_liked: boolean;
  is_reposted: boolean;
  relation_status: string | null;
}

interface FetchUserJournalFeedResult {
  journalFeedTasks: JournalFeedItemRow[];
  next_post_timestamp: number | null;
}

interface UserProfileIdRow {
  id: number | string;
}

export const fetchUserJournalFeed = async (
  journalOwnerUuid: string,
  loggedInUserUuid?: string | null,
  freeze_time?: string | number | null,
  fresh_load_pointer?: string | number | null
): Promise<FetchUserJournalFeedResult> => {
  let loggedInNumericId: number | string | null = null;
  let journalOwnerNumericId: number | string | null = null;

  // 1. Look up the internal numeric ID for the logged-in viewer (for the EXISTS checks)
  if (loggedInUserUuid) {
    const userRes = await pool.query<UserProfileIdRow>("SELECT id FROM profiles WHERE uuid = $1", [loggedInUserUuid]);
    if (userRes.rows.length > 0) {
      loggedInNumericId = userRes.rows[0].id;
    }
  }

  // 2. Look up the internal numeric ID for the owner of this specific journal tab
  if (journalOwnerUuid) {
    const ownerRes = await pool.query<UserProfileIdRow>("SELECT id FROM profiles WHERE uuid = $1", [journalOwnerUuid]);
    if (ownerRes.rows.length > 0) {
      journalOwnerNumericId = ownerRes.rows[0].id;
    }
  }

  // If the journal owner profile doesn't exist, stop immediately and return an empty set
  if (!journalOwnerNumericId) {
    return { journalFeedTasks: [], next_post_timestamp: null };
  }

  // 3. Dynamically set up parameters array ($1: viewer, $2: journal owner, $3: freeze timeline date)
  const freezeTimeValue = (freeze_time && !isNaN(Number(freeze_time))) 
    ? Number(freeze_time) 
    : Date.now();

  const Freeze_Time_Date = new Date(freezeTimeValue);
  const queryParams: (string | number | Date | null)[] = [loggedInNumericId, journalOwnerNumericId, Freeze_Time_Date];

  // 4. Wrapped UNION system structure inside a master subquery ('sub')
  let queryText = `
    SELECT * FROM (
      -- ── LAYER 1: GRAB ORIGINAL CHRONICLES WRITTEN BY THIS JOURNAL OWNER ──
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
        FALSE AS is_repost_badge, 
        NULL AS reposted_by_name,
        
        -- Count comments for original posts
        (SELECT COUNT(*)::INT FROM comments WHERE content_id = c.id) AS comments_count,

        EXISTS (
          SELECT 1 FROM interactions 
          WHERE content_id = c.id AND user_id = $1 AND interaction_type = 'like'
        ) AS is_liked,
        
        EXISTS (
          SELECT 1 FROM interactions 
          WHERE content_id = c.id AND user_id = $1 AND interaction_type = 'repost'
        ) AS is_reposted,
        
        -- 🚨 THE CRITICAL BACKEND FIX: Grab the actual string status from follows table!
        (
          SELECT status FROM follows 
          WHERE follower_id = $1 AND following_id = c.user_id
          LIMIT 1
        ) AS relation_status
        
      FROM content c 
      LEFT JOIN profiles p ON c.user_id = p.id 
      WHERE c.user_id = $2 

      UNION ALL

      -- ── LAYER 2: GRAB POSTS THAT THIS JOURNAL OWNER EXPLICITLY REPOSTED ──
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
        TRUE AS is_repost_badge, 
        CONCAT(rp.first_name, ' ', rp.last_name) AS reposted_by_name,
        
        -- Count comments for reposted content
        (SELECT COUNT(*)::INT FROM comments WHERE content_id = c.id) AS comments_count,

        EXISTS (
          SELECT 1 FROM interactions 
          WHERE content_id = c.id AND user_id = $1 AND interaction_type = 'like'
        ) AS is_liked,
        
        EXISTS (
          SELECT 1 FROM interactions 
          WHERE content_id = c.id AND user_id = $1 AND interaction_type = 'repost'
        ) AS is_reposted,
        
        -- 🚨 THE CRITICAL BACKEND FIX: Grab the actual string status from follows table!
        (
          SELECT status FROM follows 
          WHERE follower_id = $1 AND following_id = c.user_id
          LIMIT 1
        ) AS relation_status
        
      FROM content c 
      LEFT JOIN profiles p ON c.user_id = p.id 
      INNER JOIN interactions i ON i.content_id = c.id
      LEFT JOIN profiles rp ON i.user_id = rp.id
      WHERE i.user_id = $2 AND i.interaction_type = 'repost'
    ) AS sub
    WHERE sub.created_at <= $3`;

  // 5. Apply pagination cursor floor if scrolling down to page 2, 3, etc.
  if (fresh_load_pointer && fresh_load_pointer !== 'Yes_Is_FreshLoad' && !isNaN(Number(fresh_load_pointer))) {
    const last_post_creation_date = new Date(Number(fresh_load_pointer));
    queryText += ` AND sub.created_at < $4 `;
    queryParams.push(last_post_creation_date);
  }

  // 6. Sort strictly by time and apply a strict 40-post batch limit window
  queryText += ` ORDER BY sub.created_at DESC LIMIT 40`;

  const result = await pool.query<JournalFeedItemRow>(queryText, queryParams);
  const journalFeedTasks = result.rows;

  // 7. Calculate your moving pagination timestamp token for the bottom post
  let next_post_timestamp: number | null = null;
  if (journalFeedTasks.length === 40) {
    const lastItem = journalFeedTasks[journalFeedTasks.length - 1];
    next_post_timestamp = new Date(lastItem.created_at).getTime();
  }

  return {
    journalFeedTasks,
    next_post_timestamp
  };
};