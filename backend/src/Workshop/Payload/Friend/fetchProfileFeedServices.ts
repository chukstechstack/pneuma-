import pool from "@/Terminal/Supabase/supabaseConfig.js";

export interface ProfileRow {
  id: number | string;
  uuid: string;
  username: string;
  full_name: string | null; 
  avatar_url: string | null;
  created_at: string | Date;
}

export interface TaskRow {
  id: number | string;
  uuid: string;
  content: string | null;
  img: string | null;
  created_at: string | Date;
}

export interface SmartProfileFeedResult {
  profile: ProfileRow;
  isOwner: boolean;
  is_connected: boolean; // 👈 Updated from relationStatus to match the database boolean
  tasks: TaskRow[];
}

export const fetchSmartProfileFeedData = async (
  loggedInUserProfileId: number | string,
  targetProfileUuid?: string
): Promise<SmartProfileFeedResult> => {
  let profileRes;

  // 1. Fetch the target profile (or your own profile if "me" / undefined)
  if (targetProfileUuid && targetProfileUuid !== "undefined" && targetProfileUuid !== "me") {
    profileRes = await pool.query<ProfileRow>(
      `SELECT id, uuid, username, full_name, avatar_url, created_at 
       FROM profiles WHERE uuid = $1`,
      [targetProfileUuid]
    );
  } else {
    profileRes = await pool.query<ProfileRow>(
      `SELECT id, uuid, username, full_name, avatar_url, created_at 
       FROM profiles WHERE id = $1`,
      [loggedInUserProfileId]
    );
  }

  if (profileRes.rows.length === 0) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  const targetProfileData = profileRes.rows[0];
  const targetProfileNumericId = targetProfileData.id;
  const targetProfileUuidValue = targetProfileData.uuid;
  const isOwner = String(loggedInUserProfileId) === String(targetProfileNumericId);

  // 2. Fetch the logged-in user's UUID so we can check connections
  let isConnected = false;
  if (!isOwner) {
    const userUuidRes = await pool.query(
      `SELECT uuid FROM profiles WHERE id = $1`,
      [loggedInUserProfileId]
    );

    if (userUuidRes.rows.length > 0) {
      const loggedInUserUuid = userUuidRes.rows[0].uuid;

      // 3. Check if a connection exists in the database table
      const connectionCheck = await pool.query(
        `SELECT 1 FROM connections 
         WHERE connector_uuid = $1 AND connected_uuid = $2`,
        [loggedInUserUuid, targetProfileUuidValue]
      );

      isConnected = connectionCheck.rows.length > 0;
    }
  }

  // 4. Fetch the 5 newest journal scrolls for this profile
  const taskRes = await pool.query<TaskRow>(`
      SELECT id, uuid, content, img, created_at
      FROM content
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 5
  `, [targetProfileNumericId]);

  return {
    profile: targetProfileData,
    isOwner,
    is_connected: isConnected, // 👈 Returns true or false dynamically from PostgreSQL!
    tasks: taskRes.rows,
  };
};