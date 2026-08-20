import type { Request, Response } from 'express';
import pool from '../../../Terminal/Supabase/supabaseConfig';

interface CommentRow {
  id: number;
  task_uuid: string;
  author_name: string;
  avatar_url: string | null;
  author_profile_uuid: string;
  content: string;
  created_at: string | Date;
}

interface ResponsePayload {
  task_uuid: string;
  likes_count: number;
  shares_count: number;
  comments: CommentRow[];
}

export const getTaskInteractions = async (req: Request, res: Response): Promise<Response> => {
  const { taskUuid } = req.params as { taskUuid: string };

  try {
    // 1. Resolve content numeric ID from UUID
    const contentRes = await pool.query(`SELECT id FROM content WHERE uuid = $1`, [taskUuid]);
    if (contentRes.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const contentId = contentRes.rows[0].id;

    // 2. Fetch like & share counts and comments concurrently
    const countsPromise = pool.query(
      `SELECT 
         (SELECT COUNT(*)::INT FROM interactions WHERE content_id = $1 AND interaction_type = 'like') AS likes_count,
         (SELECT COUNT(*)::INT FROM interactions WHERE content_id = $1 AND interaction_type = 'share') AS shares_count`,
      [contentId]
    );

    const commentsPromise = pool.query(
      `SELECT 
         cm.id,
         c.uuid AS task_uuid,
         p.full_name AS author_name,
         p.avatar_url,
         p.uuid AS author_profile_uuid,
         cm.content,
         cm.created_at
       FROM comments cm
       JOIN content c ON cm.content_id = c.id
       JOIN profiles p ON cm.user_id = p.id
       WHERE cm.content_id = $1
       ORDER BY cm.created_at DESC;`,
      [contentId]
    );

    const [countsResult, commentsResult] = await Promise.all([countsPromise, commentsPromise]);
    const counts = countsResult.rows[0] || { likes_count: 0, shares_count: 0 };

    const responsePayload: ResponsePayload = {
      task_uuid: taskUuid,
      likes_count: counts.likes_count,
      shares_count: counts.shares_count,
      comments: commentsResult.rows,
    };

    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error('Error fetching interactions:', error);
    return res.status(500).json({ error: 'Failed to fetch task interactions' });
  }
};