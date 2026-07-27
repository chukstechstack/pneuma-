import pool from "@/Terminal/Supabase/supabaseConfig.js";
import type { PoolClient, Pool } from "pg";

interface TaskImageRow {
  img: string | null;
}

interface ContentRow {
  id: number | string;
  uuid: string;
  title: string | null;
  content: string | null;
  img: string | null;
  user_id: number | string;
  created_at: string | Date;
  [key: string]: unknown;
}

type DbClient = Pool | PoolClient;

export const fetchOldTaskImage = async (
  uuid: string,
  user_id: number | string,
  client: DbClient = pool
): Promise<TaskImageRow | null> => {
  const result = await client.query<TaskImageRow>(
    "SELECT img FROM content WHERE uuid = $1 AND user_id = $2 FOR UPDATE",
    [uuid, user_id]
  );
  return result.rows[0] || null;
};

export const executeDynamicTaskUpdate = async (
  uuid: string,
  user_id: number | string,
  contentUpdate?: string | null,
  imgUpdate?: string | null,
  client: DbClient = pool
): Promise<ContentRow | null> => {
  const updates: string[] = [];
  const values: (string | number | null)[] = [];

  if (contentUpdate !== undefined) {
    updates.push(`content = $${updates.length + 1}`);
    values.push(contentUpdate);
  }

  if (imgUpdate !== undefined) {
    updates.push(`img = $${updates.length + 1}`);
    values.push(imgUpdate);
  }

  if (updates.length === 0) return null;

  values.push(uuid, user_id);

  const queryStr = `UPDATE content 
                    SET ${updates.join(", ")} 
                    WHERE uuid = $${values.length - 1} AND user_id = $${values.length} 
                    RETURNING *`;

  const finalUpdateResult = await client.query<ContentRow>(queryStr, values);
  return finalUpdateResult.rows[0] || null;
};