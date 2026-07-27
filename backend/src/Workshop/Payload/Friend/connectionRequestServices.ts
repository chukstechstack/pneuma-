import pool from "@/Terminal/Supabase/supabaseConfig.js";
import type { PoolClient } from "pg";

export interface ProfileRow {
  id: number | string;
}

export interface FollowRow {
  id: number | string;
}

export interface ConnectServiceResult {
  didFollow: boolean;
  targetProfileUuid: string;
  followerUuid: string;
}

export const executeConnectRequestService = async (
  followerNumericId: number,
  followerUuid: string,
  targetProfileUuid: string
): Promise<ConnectServiceResult> => {
  const dbClient: PoolClient = await pool.connect();

  try {
    await dbClient.query("BEGIN");

    // 1. Check if target profile exists
    const profileRes = await dbClient.query<ProfileRow>(
      "SELECT id FROM profiles WHERE uuid = $1",
      [targetProfileUuid]
    );

    if (profileRes.rows.length === 0) {
      await dbClient.query("ROLLBACK");
      throw new Error("PROFILE_NOT_FOUND");
    }

    const followingNumericId = profileRes.rows[0].id;

    // 2. Check existing follow status
    const checkRes = await dbClient.query<FollowRow>(
      "SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2",
      [followerNumericId, followingNumericId]
    );

    let didFollow: boolean;
    if (checkRes.rows.length > 0) {
      // Unfollow / Remove connection
      await dbClient.query(
        "DELETE FROM follows WHERE follower_id = $1 AND following_id = $2",
        [followerNumericId, followingNumericId]
      );
      didFollow = false;
    } else {
      // Send connect request
      await dbClient.query(
        "INSERT INTO follows (follower_id, following_id, status) VALUES ($1, $2, 'pending')",
        [followerNumericId, followingNumericId]
      );
      didFollow = true;
    }

    await dbClient.query("COMMIT");

    return {
      didFollow,
      targetProfileUuid,
      followerUuid,
    };
  } catch (err) {
    await dbClient.query("ROLLBACK");
    throw err;
  } finally {
    dbClient.release();
  }
};