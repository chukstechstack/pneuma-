import pool from "@/Terminal/Supabase/supabaseConfig.js";
import type { PoolClient, Pool } from "pg";

interface ContentRow {
  id: number | string;
  uuid: string;
  title: string | null;
  content: string | null;
  img: string | null;
  category: string | null;
  user_id: number | string;
  likes_count?: number;
  reposts_count?: number;
  shares_count?: number;
  created_at: string | Date;
  [key: string]: unknown;
}

interface HydratedTaskRow extends ContentRow {
  author_name: string | null;
  avatar_url: string | null;
  author_profile_uuid: string;
  is_liked: boolean;
  is_reposted: boolean;
  is_following: boolean;
}

type DbClient = Pool | PoolClient;

export const insertNewTask = async (
  content: string | null,
  img_url: string | null,
  user_id: number | string,
  client: DbClient = pool
): Promise<ContentRow | null> => {

  const result = await client.query<ContentRow>(
    `INSERT INTO content(title, content, img, category, user_id) 
     VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [null, content, img_url, null, user_id]
  );
  return result.rows[0] || null;
};

// 2. Query data with author profile mappings for real-time frontend integration
export const fetchHydratedTaskById = async (
  newPostId: number | string,
  client: DbClient = pool
): Promise<HydratedTaskRow | null> => {
  const result = await client.query<HydratedTaskRow>(
    `SELECT c.*,
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
     WHERE c.id = $1`,
    [newPostId]
  );
  return result.rows[0] || null;
};

// 3. Fan out alerts to all connections when a task is published 🚀
export const createConnectionAlertsForTask = async (
  actorUserUuid: string,
  newPostId: number | string,
  client: DbClient = pool
): Promise<void> => {
  // Find all accepted connections where this user is either sender or receiver
  const connectionsResult = await client.query<{ connection_uuid: string }>(
    `SELECT 
       CASE 
         WHEN sender_uuid = $1 THEN receiver_uuid 
         ELSE sender_uuid 
       END AS connection_uuid 
     FROM connections 
     WHERE (sender_uuid = $1 OR receiver_uuid = $1) 
       AND status = 'accepted'`,
    [actorUserUuid]
  );

  const connections = connectionsResult.rows;
  if (connections.length === 0) return;

  const insertQuery = `
    INSERT INTO alerts (recipient_uuid, actor_uuid, type, reference_id)
    VALUES 
  `;

  const values: any[] = [];
  const placeholders = connections.map((conn, index) => {
    const base = index * 4;
    values.push(conn.connection_uuid, actorUserUuid, 'new_post', newPostId);
    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
  });

  await client.query(insertQuery + placeholders.join(', '), values);
};