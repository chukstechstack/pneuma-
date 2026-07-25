import pool from "@/Terminal/Supabase/supabaseConfig";
import type { PoolClient, Pool } from "pg";

interface TaskImageRow {
  img: string | null;
}

type DbClient = Pool | PoolClient;


export const findTaskImageForCleanup = async (
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

// 2. Executes the physical row removal from the database tables
export const executeTaskDeletion = async (
  uuid: string,
  user_id: number | string,
  client: DbClient = pool
): Promise<number | null> => {
  const result = await client.query(
    "DELETE FROM content WHERE uuid = $1 AND user_id = $2",
    [uuid, user_id]
  );
  return result.rowCount; // Returns how many records were altered (0 or 1)
};