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

export const fetchUserJournalFeed = async (
  journalOwnerUuid: string,
  loggedInUserUuid?: string | null,
  fresh_load_pointer?: string | number | null
): Promise<FetchUserJournalFeedResult> => {
  let loggedInNumericId: number | string | null = null;
  let journalOwnerNumericId: number | string | null = null;

  if (loggedInUserUuid || journalOwnerUuid) {
    const res = await pool.query(
      `SELECT id, uuid FROM profiles WHERE uuid = ANY($1)`,
      [[loggedInUserUuid, journalOwnerUuid].filter(Boolean)]
    );
    for (const row of res.rows) {
      if (row.uuid === loggedInUserUuid) loggedInNumericId = row.id;
      if (row.uuid === journalOwnerUuid) journalOwnerNumericId = row.id;
    }
  }

  if (!journalOwnerNumericId) {
    return { journalFeedTasks: [], next_post_timestamp: null };
  }

  const queryParams: (string | number | Date | null)[] = [loggedInNumericId, journalOwnerNumericId];

  let queryText = `
    SELECT * FROM (
      -- Layer 1: Original posts by the user
      SELECT 
        c.*, 
        p.full_name AS author_name, 
        p.avatar_url, 
        p.uuid AS author_profile_uuid,
        FALSE AS is_repost_badge, 
        NULL AS reposted_by_name,
        (SELECT COUNT(*)::INT FROM comments WHERE content_id = c.id) AS comments_count,
        EXISTS(SELECT 1 FROM interactions WHERE content_id = c.id AND user_id = $1 AND interaction_type = 'like') AS is_liked,
        EXISTS(SELECT 1 FROM interactions WHERE content_id = c.id AND user_id = $1 AND interaction_type = 'repost') AS is_reposted,
        (SELECT status FROM follows WHERE follower_id = $1 AND following_id = c.user_id LIMIT 1) AS relation_status
      FROM content c 
      LEFT JOIN profiles p ON c.user_id = p.id 
      WHERE c.user_id = $2

      UNION ALL

      -- Layer 2: Reposted posts
      SELECT 
        c.*, 
        p.full_name AS author_name, 
        p.avatar_url, 
        p.uuid AS author_profile_uuid,
        TRUE AS is_repost_badge, 
        rp.full_name AS reposted_by_name,
        (SELECT COUNT(*)::INT FROM comments WHERE content_id = c.id) AS comments_count,
        EXISTS(SELECT 1 FROM interactions WHERE content_id = c.id AND user_id = $1 AND interaction_type = 'like') AS is_liked,
        EXISTS(SELECT 1 FROM interactions WHERE content_id = c.id AND user_id = $1 AND interaction_type = 'repost') AS is_reposted,
        (SELECT status FROM follows WHERE follower_id = $1 AND following_id = c.user_id LIMIT 1) AS relation_status
      FROM content c 
      LEFT JOIN profiles p ON c.user_id = p.id 
      JOIN interactions i ON i.content_id = c.id
      LEFT JOIN profiles rp ON i.user_id = rp.id
      WHERE i.user_id = $2 AND i.interaction_type = 'repost'
    ) AS sub
    WHERE sub.created_at <= NOW()
  `;

  if (fresh_load_pointer && fresh_load_pointer !== 'Yes_Is_FreshLoad' && !isNaN(Number(fresh_load_pointer))) {
    queryParams.push(new Date(Number(fresh_load_pointer)));
    queryText += ` AND sub.created_at < $3`;
  }

  queryText += ` ORDER BY sub.created_at DESC LIMIT 40`;

  const result = await pool.query<JournalFeedItemRow>(queryText, queryParams);
  const journalFeedTasks = result.rows;

  let next_post_timestamp: number | null = null;
  if (journalFeedTasks.length === 40) {
    next_post_timestamp = new Date(journalFeedTasks[journalFeedTasks.length - 1].created_at).getTime();
  }

  return { journalFeedTasks, next_post_timestamp };
};

