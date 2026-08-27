import pool from "@/Terminal/Supabase/supabaseConfig.js";
export const findTaskImageForCleanup = async (uuid, user_id, client = pool) => {
    const result = await client.query("SELECT img FROM content WHERE uuid = $1 AND user_id = $2 FOR UPDATE", [uuid, user_id]);
    return result.rows[0] || null;
};
// 2. Executes the physical row removal from the database tables
export const executeTaskDeletion = async (uuid, user_id, client = pool) => {
    const result = await client.query("DELETE FROM content WHERE uuid = $1 AND user_id = $2", [uuid, user_id]);
    return result.rowCount; // Returns how many records were altered (0 or 1)
};
//# sourceMappingURL=deleteTaskService.js.map