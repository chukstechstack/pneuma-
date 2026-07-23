import pool from "../../db/config/supabaseConfig.js";

// 1. Verifies ownership and retrieves the image path string for S3 asset matching
export const findTaskImageForCleanup = async (uuid, user_id, client = pool) => {
  const result = await client.query(
    // ADDED FOR UPDATE here to lock the row while we determine if an image needs clearing
    "SELECT img FROM content WHERE uuid = $1 AND user_id = $2 FOR UPDATE",
    [uuid, user_id]
  );
  return result.rows[0] || null;
};

// 2. Executes the physical row removal from the database tables
export const executeTaskDeletion = async (uuid, user_id, client = pool) => {
  const result = await client.query(
    "DELETE FROM content WHERE uuid = $1 AND user_id = $2",
    [uuid, user_id]
  );
  return result.rowCount; // Returns how many records were altered (0 or 1)
};
