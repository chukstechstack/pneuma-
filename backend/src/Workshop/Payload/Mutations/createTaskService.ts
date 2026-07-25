import pool from "@/Terminal/Supabase/supabaseConfig";
import type { PoolClient, Pool } from "pg";

interface ContentRow {
  id: number | string;
  uuid: string;
  title: string | null;
  content: string | null;
  img: string | null;
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
    `INSERT INTO content(title, content, img, user_id) 
     VALUES($1, $2, $3, $4) RETURNING *`,
    ['Insight', content, img_url, user_id]
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
            CONCAT(p.first_name, ' ', p.last_name) AS author_name,
            p.avatar_url,
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