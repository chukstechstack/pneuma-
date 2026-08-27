import pool from "@/Terminal/Supabase/supabaseConfig.js";
export const fetchOldTaskImage = async (uuid, user_id, client = pool) => {
    const result = await client.query("SELECT img FROM content WHERE uuid = $1 AND user_id = $2 FOR UPDATE", [uuid, user_id]);
    return result.rows[0] || null;
};
export const executeDynamicTaskUpdate = async (uuid, user_id, contentUpdate, imgUpdate, client = pool) => {
    const updates = [];
    const values = [];
    if (contentUpdate !== undefined) {
        updates.push(`content = $${updates.length + 1}`);
        values.push(contentUpdate);
    }
    if (imgUpdate !== undefined) {
        updates.push(`img = $${updates.length + 1}`);
        values.push(imgUpdate);
    }
    if (updates.length === 0)
        return null;
    values.push(uuid, user_id);
    const queryStr = `UPDATE content 
                    SET ${updates.join(", ")} 
                    WHERE uuid = $${values.length - 1} AND user_id = $${values.length} 
                    RETURNING *`;
    const finalUpdateResult = await client.query(queryStr, values);
    return finalUpdateResult.rows[0] || null;
};
//# sourceMappingURL=patchTaskService.js.map