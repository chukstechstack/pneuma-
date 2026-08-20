import pool from "@/Terminal/Supabase/supabaseConfig.js";

interface JournalFeedItemRow {
  id: number | string;
  uuid: string;
  title: string | null;
  content: string | null;
  img: string | null;
  created_at: string | Date;
  author_name: string | null;
  avatar_url: string | null;
  author_profile_uuid: string;
  user_id: number | string;
  is_repost_badge: boolean;
  reposted_by_name: string | null;
  is_liked: boolean;
  is_reposted: boolean;
}

interface FetchUserJournalFeedResult {
  journalFeedTasks: JournalFeedItemRow[];
  next_post_timestamp: number | null;
}

export const fetchUserJournalFeed = async (
  journalOwnerUuid: string | null | undefined,
  loggedInUserUuid?: string | null,
  fresh_load_pointer?: string | number | null
): Promise<FetchUserJournalFeedResult> => {
  if (!journalOwnerUuid || journalOwnerUuid === "undefined") {
    console.warn("⚠️ fetchUserJournalFeed aborted: journalOwnerUuid is missing or invalid.");
    return { journalFeedTasks: [], next_post_timestamp: null };
  }

  let journalOwnerNumericId: number | string | null = null;

  const res = await pool.query(
    `SELECT id, uuid FROM profiles WHERE uuid = $1`,
    [journalOwnerUuid]
  );
  if (res.rows.length > 0) {
    journalOwnerNumericId = res.rows[0].id;
  }

  if (!journalOwnerNumericId) {
    return { journalFeedTasks: [], next_post_timestamp: null };
  }

  const queryParams: (string | number | Date | null)[] = [journalOwnerNumericId];

  let queryText = `
    SELECT 
      c.*, 
      p.full_name AS author_name, 
      p.avatar_url, 
      p.uuid AS author_profile_uuid,
      FALSE AS is_repost_badge, 
      NULL AS reposted_by_name,
      FALSE AS is_liked,
      FALSE AS is_reposted
    FROM content c 
    LEFT JOIN profiles p ON c.user_id = p.id 
    WHERE c.user_id = $1 AND c.created_at <= NOW()
  `;

  if (fresh_load_pointer && fresh_load_pointer !== 'Yes_Is_FreshLoad' && !isNaN(Number(fresh_load_pointer))) {
    queryParams.push(new Date(Number(fresh_load_pointer)));
    queryText += ` AND c.created_at < $2`;
  }

  queryText += ` ORDER BY c.created_at DESC LIMIT 40`;

  const result = await pool.query<JournalFeedItemRow>(queryText, queryParams);
  const journalFeedTasks = result.rows;

  let next_post_timestamp: number | null = null;
  if (journalFeedTasks.length === 40) {
    next_post_timestamp = new Date(journalFeedTasks[journalFeedTasks.length - 1].created_at).getTime();
  }

  return { journalFeedTasks, next_post_timestamp };
};