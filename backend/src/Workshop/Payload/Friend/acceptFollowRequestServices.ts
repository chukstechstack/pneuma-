import pool from "@/Terminal/Supabase/supabaseConfig";
import type { PoolClient } from "pg";

export interface ProfileRow {
  id: number | string;
}

export interface AcceptFollowServiceResult {
  action: 'accept' | 'decline';
  targetUuid: string;
  acceptorUuid: string;
}

export const executeAcceptFollowService = async (
  acceptorNumericId: number,
  acceptorUuid: string,
  targetUuid: string,
  action: 'accept' | 'decline'
): Promise<AcceptFollowServiceResult> => {
  const dbClient: PoolClient = await pool.connect();

  try {
    await dbClient.query("BEGIN");

    const profileRes = await dbClient.query<ProfileRow>(
      `SELECT id FROM profiles WHERE uuid = $1`,
      [targetUuid]
    );

    if (profileRes.rows.length === 0) {
      await dbClient.query("ROLLBACK");
      throw new Error("PROFILE_NOT_FOUND");
    }

    const requesterNumericId = profileRes.rows[0].id;

    if (action === 'accept') {
      await dbClient.query(
        `UPDATE follows SET status = 'active' 
         WHERE follower_id = $1 AND following_id = $2 AND status = 'pending'`,
        [requesterNumericId, acceptorNumericId]
      );
    } else if (action === 'decline') {
      await dbClient.query(
        `DELETE FROM follows 
         WHERE follower_id = $1 AND following_id = $2 AND status = 'pending'`,
        [requesterNumericId, acceptorNumericId]
      );
    }

    await dbClient.query("COMMIT");

    return {
      action,
      targetUuid,
      acceptorUuid,
    };
  } catch (err) {
    await dbClient.query("ROLLBACK");
    throw err;
  } finally {
    dbClient.release();
  }
};