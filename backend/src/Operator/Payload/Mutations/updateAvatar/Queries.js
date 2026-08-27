export const executeAvatarDatabaseTransactions = async (dbClient, userUuid, avatarUrl, bufferLength) => {
    // 1. Deactivate old avatar records
    await dbClient.query(`UPDATE user_avatars SET is_active = FALSE WHERE profile_uuid = $1`, [userUuid]);
    // 2. Insert new avatar record into history table
    await dbClient.query(`INSERT INTO user_avatars (profile_uuid, image_url, file_size, mime_type, is_active)
     VALUES ($1, $2, $3, $4, TRUE)`, [userUuid, avatarUrl, bufferLength, "image/webp"]);
    // 3. Update the main profiles table for fast access
    const updateProfileResult = await dbClient.query(`UPDATE profiles SET avatar_url = $1 WHERE uuid = $2 RETURNING *`, [avatarUrl, userUuid]);
    if (updateProfileResult.rows.length === 0) {
        throw new Error("Profile not found for avatar update");
    }
    return updateProfileResult.rows[0];
};
//# sourceMappingURL=Queries.js.map