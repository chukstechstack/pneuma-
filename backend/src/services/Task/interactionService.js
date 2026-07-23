import pool from "../../db/config/supabaseConfig.js";

/**
 * Handles toggling user interactions (likes, reposts, shares) atomically in Postgres
 * @param {number} user_numeric_id - Internal numeric ID of the active user
 * @param {string} contentUuid - The public UUID string of the target post
 * @param {string} type - Whitelisted interaction type ('like', 'repost', 'share')
 * @returns {Promise<{action: 'added' | 'removed', updatedPost: object}>}
 */
export const executeToggleInteraction = async (user_numeric_id, contentUuid, type) => {
  const dbClient = await pool.connect();

  try {
    await dbClient.query("BEGIN");

    // 1. Look up the internal numeric content ID using the public UUID string
    const contentRes = await dbClient.query(
      `SELECT id FROM content WHERE uuid = $1`,
      [contentUuid]
    );

    if (contentRes.rows.length === 0) {
      await dbClient.query("ROLLBACK");
      return { error: "Post not found", status: 404 };
    }

    const contentId = contentRes.rows[0].id; 

    // 2. Check if this exact interaction already exists in the logs
    const checkRes = await dbClient.query(
      `SELECT id FROM interactions 
       WHERE user_id = $1 AND content_id = $2 AND interaction_type = $3`,
      [user_numeric_id, contentId, type]
    );

    const alreadyExists = checkRes.rows.length > 0;
    const action = alreadyExists ? "removed" : "added";

    if (alreadyExists) {
      // A. REMOVE INTERACTION ACTION
      await dbClient.query(
        `DELETE FROM interactions 
         WHERE user_id = $1 AND content_id = $2 AND interaction_type = $3`,
         [user_numeric_id, contentId, type]
      );

      // B. SECURE ATOMIC COALESCE DECREMENTING: GREATEST prevents negative values
      if (type === 'like') {
        await dbClient.query(`UPDATE content SET likes_count = GREATEST(0, COALESCE(likes_count, 0) - 1) WHERE id = $1`, [contentId]);
      } else if (type === 'repost') {
        await dbClient.query(`UPDATE content SET reposts_count = GREATEST(0, COALESCE(reposts_count, 0) - 1) WHERE id = $1`, [contentId]);
      } else if (type === 'share') {
        await dbClient.query(`UPDATE content SET shares_count = GREATEST(0, COALESCE(shares_count, 0) - 1) WHERE id = $1`, [contentId]);
      }
    } else {
      // C. ADD NEW INTERACTION ACTION
      await dbClient.query(
        `INSERT INTO interactions (user_id, content_id, interaction_type) 
         VALUES ($1, $2, $3)`,
        [user_numeric_id, contentId, type]
      );

      // D. SECURE ATOMIC INCREMENTING: Combats high-speed millisecond race conditions
      if (type === 'like') {
        await dbClient.query(`UPDATE content SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = $1`, [contentId]);
      } else if (type === 'repost') {
        await dbClient.query(`UPDATE content SET reposts_count = COALESCE(reposts_count, 0) + 1 WHERE id = $1`, [contentId]);
      } else if (type === 'share') {
        await dbClient.query(`UPDATE content SET shares_count = COALESCE(shares_count, 0) + 1 WHERE id = $1`, [contentId]);
      }
    }

    // 3. Extract the freshly updated counter scores to return back to the application layers
    const postRes = await dbClient.query(
      `SELECT id, uuid, likes_count, reposts_count, shares_count FROM content WHERE id = $1`,
      [contentId]
    );

    await dbClient.query("COMMIT");

    return {
      action,
      updatedPost: postRes.rows[0] // Returns a single clean object instead of an array wrapper
    };

  } catch (err) {
    await dbClient.query("ROLLBACK");
    throw err; // Forward error upwards so the controller can catch it cleanly
  } finally {
    dbClient.release();
  }
};
