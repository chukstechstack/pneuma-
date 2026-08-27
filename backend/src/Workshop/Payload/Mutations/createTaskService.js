import pool from "@/Terminal/Supabase/supabaseConfig.js";
export const insertNewTask = async (content, img_url, user_id, client = pool) => {
    const result = await client.query(`INSERT INTO content(title, content, img, category, user_id) 
     VALUES($1, $2, $3, $4, $5) RETURNING *`, [null, content, img_url, null, user_id]);
    return result.rows[0] || null;
};
// 2. Query data with author profile mappings for real-time frontend integration
export const fetchHydratedTaskById = async (newPostId, client = pool) => {
    const result = await client.query(`SELECT c.*,
            c.user_id,
            p.full_name AS author_name,      -- 👉 Alias to match TaskHeader
            p.avatar_url AS author_avatar_url,  -- 👉 Alias to match TaskHeader
            p.uuid AS author_profile_uuid,
            c.likes_count,    
            c.reposts_count,  
            c.shares_count,   
            false AS is_liked,    
            false AS is_reposted,   
            false AS is_following   
     FROM content c
     JOIN profiles p ON c.user_id = p.id
     WHERE c.id = $1`, [newPostId]);
    return result.rows[0] || null;
};
// 3. Fan out alerts to all connections when a task is published 🚀
export const createConnectionAlertsForTask = async (actorUserUuid, newPostId, client = pool) => {
    // 1. Resolve the actor's numeric ID and get all connected user UUIDs in one clean step
    const actorRes = await client.query(`SELECT id FROM profiles WHERE uuid = $1`, [actorUserUuid]);
    if (actorRes.rows.length === 0)
        return;
    const actorId = actorRes.rows[0].id;
    // Find all connected users where this user is either connector or connected
    const connectionsResult = await client.query(`SELECT 
       CASE 
         WHEN connector_uuid = $1 THEN connected_uuid 
         ELSE connector_uuid 
       END AS connection_uuid 
     FROM connections 
     WHERE (connector_uuid = $1 OR connected_uuid = $1)`, [actorUserUuid]);
    const connectionUuids = connectionsResult.rows.map(r => r.connection_uuid);
    if (connectionUuids.length === 0)
        return;
    // 2. Resolve the connected users' UUIDs to their numeric IDs
    const profilesRes = await client.query(`SELECT id, uuid FROM profiles WHERE uuid = ANY($1::uuid[])`, // 👈 Changed text[] to uuid[]
    [connectionUuids]);
    if (profilesRes.rows.length === 0)
        return;
    const insertQuery = `
    INSERT INTO alerts (recipient_id, actor_id, type, reference_id)
    VALUES 
  `;
    const values = [];
    const placeholders = profilesRes.rows.map((profile, index) => {
        const base = index * 4;
        values.push(profile.id, actorId, 'new_post', newPostId);
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
    });
    await client.query(insertQuery + placeholders.join(', '), values);
};
//# sourceMappingURL=createTaskService.js.map