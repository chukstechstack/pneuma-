import pool from "@/Terminal/Supabase/supabaseConfig.js";

export interface CommentRow {
  id: number;
  uuid: string;
  parent_id: number | null;
  comment_text: string;
  created_at: string | Date;
  author_name: string | null;
  avatar_url: string | null;
}

export const fetchCommentsQuery = async (
  contentId: number,
  freezeTimeDate: Date,
  freshLoadPointer: string,
  lastCommentDateParam?: Date
): Promise<CommentRow[]> => {
  const queryParams: (number | Date)[] = [contentId, freezeTimeDate];

  let queryText = `
    SELECT 
      c.id,
      c.uuid,
      c.parent_id,
      c.comment_text,
      c.created_at,
      CONCAT(p.first_name, ' ', p.last_name) AS author_name,
      p.avatar_url
    FROM comments c
    LEFT JOIN profiles p ON c.user_id = p.id
    WHERE c.content_id = $1 AND c.created_at <= $2
  `;

  if (freshLoadPointer && freshLoadPointer !== "Yes_Is_FreshLoad" && lastCommentDateParam) {
    queryText += ` AND c.created_at < $3`;
    queryParams.push(lastCommentDateParam);
  }

  queryText += ` ORDER BY c.created_at DESC LIMIT 40`;

  const { rows } = await pool.query<CommentRow>(queryText, queryParams);
  return rows;
};

export const fetchContentIdByUuid = async (contentUuid: string): Promise<number | null> => {
  const checkContent = await pool.query<{ id: number }>("SELECT id FROM content WHERE uuid = $1", [contentUuid]);
  if (checkContent.rows.length === 0) {
    return null;
  }
  return checkContent.rows[0].id;
};