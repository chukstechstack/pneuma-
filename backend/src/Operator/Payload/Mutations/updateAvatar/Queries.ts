import type { PoolClient } from "pg";
interface ProfileIdRow {
  id: number;
}

interface ProfileRow {
  [column: string]: unknown;
}

export const executeAvatarDatabaseTransactions = async (
  dbClient: PoolClient,
  userUuid: string,
  avatarUrl: string,
  bufferLength: number
): Promise<ProfileRow> => {
  // 1. Get the integer profile id from the profiles table using the user_uuid string
  const profileRes = await dbClient.query<ProfileIdRow>(`SELECT id FROM profiles WHERE uuid = $1`, [userUuid]);
  if (profileRes.rows.length === 0) {
    throw new Error("Profile not found for avatar update");
  }
  const profileId = profileRes.rows[0].id;

  // 2. Deactivate old avatar records using profile_id
  await dbClient.query(`UPDATE user_avatars SET is_active = FALSE WHERE profile_id = $1`, [profileId]);

  // 3. Insert new avatar record into history table using profile_id
  await dbClient.query(
    `INSERT INTO user_avatars (profile_id, image_url, file_size, mime_type, is_active)
         VALUES ($1, $2, $3, $4, TRUE)`,
    [profileId, avatarUrl, bufferLength, "image/webp"]
  );

  // 4. Update the main profiles table for fast access using uuid
  const updateProfileResult = await dbClient.query<ProfileRow>(
    `UPDATE profiles SET avatar_url = $1 WHERE uuid = $2 RETURNING *`,
    [avatarUrl, userUuid]
  );

  if (updateProfileResult.rows.length === 0) {
    throw new Error("Profile not found for avatar update");
  }

  return updateProfileResult.rows[0];
};