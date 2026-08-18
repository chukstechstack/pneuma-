import pool from "@/Terminal/Supabase/supabaseConfig.js";
import type { PoolClient } from "pg";

interface CommentRow {
  id: number | string;
  uuid: string;
  content_id: number | string;
  parent_id: number | string | null;
  comment_text: string;
  created_at: string | Date;
}

interface ProfileRow {
  author_name: string | null;
  avatar_url: string | null;
}

export interface HydratedComment extends CommentRow {
  author_name: string | null;
  avatar_url: string | null;
}

export const executeInsertComment = async (
  contentUuid: string,
  user_id: number | string,
  comment_text?: string
): Promise<{ comment: HydratedComment } | { error: string; status: number }> => {
  if (!comment_text || comment_text.trim() === "") {
    return { error: "Add a comment", status: 400 };
  }

  const dbClient: PoolClient = await pool.connect();

  try {
    await dbClient.query("BEGIN");

    const checkContent = await dbClient.query<{ id: number | string }>(
      "SELECT id FROM content WHERE uuid = $1", 
      [contentUuid]
    );

    if (checkContent.rows.length === 0) {
      await dbClient.query("ROLLBACK");
      return { error: "journal post not found", status: 404 };
    }

    const content_id = checkContent.rows[0].id;

    const insertQuery = `
      INSERT INTO comments (content_id, user_id, comment_text) 
      VALUES ($1, $2, $3) 
      RETURNING id, uuid, content_id, parent_id, comment_text, created_at;
    `;
    const result = await dbClient.query<CommentRow>(insertQuery, [content_id, user_id, comment_text]);
    const newComment = result.rows[0];
    
    const profileUser = await dbClient.query<ProfileRow>(
      "SELECT full_name  AS author_name, avatar_url FROM profiles WHERE id = $1", 
      [user_id]
    );

    const authorProfile = profileUser.rows[0];
    
    await dbClient.query("COMMIT");

    return {
      comment: {
        ...newComment,
        author_name: authorProfile?.author_name || null,
        avatar_url: authorProfile?.avatar_url || null
      }
    };

  } catch (err) {
    await dbClient.query("ROLLBACK");
    throw err;
  } finally {
    dbClient.release();
  }
};