import pool from "../../config/supabaseConfig.js";

export const fetchOldTaskImage = async (uuid, user_id, client = pool) => {
  const result = await client.query(
    "SELECT img FROM content WHERE uuid = $1 AND user_id = $2 FOR UPDATE", // Added FOR UPDATE
    [uuid, user_id]
  );
  return result.rows[0] || null;
};


// ADDED: client parameter at the very end
export const executeDynamicTaskUpdate = async (uuid, user_id, contentUpdate, imgUpdate, client = pool) => {
  const updates = [];
  const values = [];

  if (contentUpdate) {
    updates.push(`content = $${updates.length + 1}`);
    values.push(contentUpdate);
  }

  if (imgUpdate) {
    updates.push(`img = $${updates.length + 1}`);
    values.push(imgUpdate);
  }

  if (updates.length === 0) return null;

  values.push(uuid, user_id);

  const queryStr = `UPDATE content 
                    SET ${updates.join(", ")} 
                    WHERE uuid = $${values.length - 1} AND user_id = $${values.length} 
                    RETURNING *`;

  // CHANGED: Uses the passed transaction client instead of the global pool
  const finalUpdateResult = await client.query(queryStr, values);
  return finalUpdateResult;
};
