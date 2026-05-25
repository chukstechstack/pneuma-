import pool from "../../config/supabaseConfig.js";

export const fetchUserJournalFeed = async (journalOwnerUuid, loggedInUserUuid) => {
  let loggedInNumericId = null;
  let journalOwnerNumericId = null;

  // 1. Look up the internal numeric ID for the logged-in viewer (for the EXISTS checks)
  if (loggedInUserUuid) {
    const userRes = await pool.query("SELECT id FROM profiles WHERE uuid = $1", [loggedInUserUuid]);
    if (userRes.rows.length > 0) {
      loggedInNumericId = userRes.rows[0].id;
    }
  }

  // 2. Look up the internal numeric ID for the owner of this specific journal tab
  if (journalOwnerUuid) {
    const ownerRes = await pool.query("SELECT id FROM profiles WHERE uuid = $1", [journalOwnerUuid]);
    if (ownerRes.rows.length > 0) {
      journalOwnerNumericId = ownerRes.rows[0].id;
    }
  }

  // 3. RUN THE DUAL JOURNAL UNION SYSTEM
  const result = await pool.query(
    `
    -- ── LAYER 1: GRAB ORIGINAL CHRONICLES WRITTEN BY THIS JOURNAL OWNER ──
    SELECT 
      c.id, c.uuid, c.title, c.content, c.img, c.created_at,
      c.likes_count, c.reposts_count, c.shares_count,   
      CONCAT(p.first_name, ' ', p.last_name) AS author_name, 
      p.avatar_url, p.uuid AS author_profile_uuid, c.user_id,
      FALSE AS is_repost_badge, -- It's their own original post
      NULL AS reposted_by_name,
      
      -- Checking interaction checkboxes for the active viewer ($1)
      EXISTS (SELECT 1 FROM interactions WHERE content_id = c.id AND user_id = $1 AND interaction_type = 'like') AS is_liked,
      EXISTS (SELECT 1 FROM interactions WHERE content_id = c.id AND user_id = $1 AND interaction_type = 'repost') AS is_reposted,
      EXISTS (SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = c.user_id) AS is_following
    FROM content c 
    LEFT JOIN profiles p ON c.user_id = p.id 
    WHERE c.user_id = $2 -- Filters for the journal owner's numbers

    UNION ALL

    -- ── LAYER 2: GRAB POSTS THAT THIS JOURNAL OWNER EXPLICITLY REPOSTED ──
    SELECT 
      c.id, c.uuid, c.title, c.content, c.img, c.created_at,
      c.likes_count, c.reposts_count, c.shares_count,   
      CONCAT(p.first_name, ' ', p.last_name) AS author_name, 
      p.avatar_url, p.uuid AS author_profile_uuid, c.user_id,
      TRUE AS is_repost_badge, -- Tells frontend to paint the "Reposted" text banner!
      CONCAT(rp.first_name, ' ', rp.last_name) AS reposted_by_name,
      
      -- Keeps checkbox states accurate for the active viewer ($1)
      EXISTS (SELECT 1 FROM interactions WHERE content_id = c.id AND user_id = $1 AND interaction_type = 'like') AS is_liked,
      EXISTS (SELECT 1 FROM interactions WHERE content_id = c.id AND user_id = $1 AND interaction_type = 'repost') AS is_reposted,
      EXISTS (SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = c.user_id) AS is_following
    FROM content c 
    LEFT JOIN profiles p ON c.user_id = p.id 
    -- Link the interactions tracker table row representing the repost click event
    INNER JOIN interactions i ON i.content_id = c.id
    -- Link the profile details of the person who owns this specific journal tab
    LEFT JOIN profiles rp ON i.user_id = rp.id
    WHERE i.user_id = $2 AND i.interaction_type = 'repost'

    -- ── COMBINE AND ORGANIZE TIMELINE ──
    ORDER BY created_at DESC
    `,
    [loggedInNumericId, journalOwnerNumericId]
  );

  return result.rows;
};
