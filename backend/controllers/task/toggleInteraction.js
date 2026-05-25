import pool from "../../config/supabaseConfig.js"; 
import redisClient from "../../config/redisCreateClient.js";

export const toggleInteraction = async (req, res, next) => {
  const user_numeric_id = req.user?.id; 
  const user_uuid = req.user?.uuid;
  const { contentUuid } = req.params; // 1. CHANGE: Grab the public UUID string from the URL path
  const { type } = req.body;        

  if (!['like', 'repost', 'share'].includes(type)) {
    return res.status(400).json({ error: "Invalid interaction type" });
  }

  const dbClient = await pool.connect();

  try {
    await dbClient.query("BEGIN");

    // 2. NEW SAFETY STEP: Look up the hidden numeric content ID using the public UUID string
    const contentRes = await dbClient.query(
      `SELECT id FROM content WHERE uuid = $1`,
      [contentUuid]
    );

    if (contentRes.rows.length === 0) {
      await dbClient.query("ROLLBACK");
      dbClient.release();
      return res.status(404).json({ error: "Chronicle not found" });
    }

    const contentId = contentRes.rows[0].id; // This is our safe internal number box!
    const counterColumn = `${type}s_count`; 

    // 3. The rest of your code handles the internal transactions exactly the same way...
    const checkRes = await dbClient.query(
      `SELECT id FROM interactions 
       WHERE user_id = $1 AND content_id = $2 AND interaction_type = $3`,
      [user_numeric_id, contentId, type]
    );

    const alreadyExists = checkRes.rows.length > 0;

    if (alreadyExists) {
      await dbClient.query(
        `DELETE FROM interactions 
         WHERE user_id = $1 AND content_id = $2 AND interaction_type = $3`,
        [user_numeric_id, contentId, type]
      );

      await dbClient.query(
        `UPDATE content SET ${counterColumn} = ${counterColumn} - 1 WHERE id = $1`,
        [contentId]
      );
    } else {
      await dbClient.query(
        `INSERT INTO interactions (user_id, content_id, interaction_type) 
         VALUES ($1, $2, $3)`,
        [user_numeric_id, contentId, type]
      );

      await dbClient.query(
        `UPDATE content SET ${counterColumn} = ${counterColumn} + 1 WHERE id = $1`,
        [contentId]
      );
    }

    // 4. Return the updated scores along with the uuid
    const postRes = await dbClient.query(
      `SELECT id, uuid, likes_count, reposts_count, shares_count FROM content WHERE id = $1`,
      [contentId]
    );

    await dbClient.query("COMMIT");

    const cacheKey = `tasks_feed:${user_uuid || 'guest'}`;
    await redisClient.del(cacheKey);

        // 🔽 ADD THIS SUCCESS LOG FOR YOUR BACKEND TERMINAL
    console.log(`💾 [DB SAVED]: User (ID: ${user_numeric_id}) successfully performed "${type}" on Post (UUID: ${contentUuid}). Action: ${alreadyExists ? "Removed" : "Added"}`);

    return res.json({
      message: "Interaction updated successfully",
      action: alreadyExists ? "removed" : "added",
      updatedPost: postRes.rows[0]
    });

  } catch (err) {
    await dbClient.query("ROLLBACK");
     console.error("❌ DATABASE CRASH DETAILS:", err.message);
    next(err);
  } finally {
    dbClient.release();
  }
};
