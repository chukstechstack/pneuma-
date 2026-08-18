import pool from "@/Terminal/Supabase/supabaseConfig.js";

export interface ProfileRow {
  id: number | string;
  uuid: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string | Date;
}

export interface FollowRow {
  status: string;
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
  relationStatus: string | null;
  tasks: TaskRow[];
}

export const fetchSmartProfileFeedData = async (
  loggedInUserProfileId: number | string,
  targetProfileUuid?: string
): Promise<SmartProfileFeedResult> => {
  let profileRes;

  if (targetProfileUuid && targetProfileUuid !== "undefined" && targetProfileUuid !== "me") {
    profileRes = await pool.query<ProfileRow>(
      `SELECT id, uuid, username, full_name, avatar_url, created_at 
       FROM profiles WHERE uuid = $1`,
      [targetProfileUuid]
    );
  } else {
    profileRes = await pool.query<ProfileRow>(
      `SELECT id, uuid, username, full_name,  avatar_url, created_at 
       FROM profiles WHERE id = $1`,
      [loggedInUserProfileId]
    );
  }

  if (profileRes.rows.length === 0) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  const targetProfileData = profileRes.rows[0];
  const targetProfileNumericId = targetProfileData.id;
  const isOwner = String(loggedInUserProfileId) === String(targetProfileNumericId);

  let relationStatus: string | null = null;
  let visibleTasks: TaskRow[] = [];

  if (!isOwner) {
    const followCheck = await pool.query<FollowRow>(
      `SELECT status 
       FROM follows 
       WHERE (
          (follower_id = $1 AND following_id = $2) 
          OR 
          (follower_id = $2 AND following_id = $1)
       ) 
       AND status = 'active'
       LIMIT 1`,
      [loggedInUserProfileId, targetProfileNumericId]
    );

    if (followCheck.rows.length > 0) {
      relationStatus = "active";
    }
  }

  if (isOwner || relationStatus === "active") {
    const taskRes = await pool.query<TaskRow>(`
        SELECT id, uuid, content, img, created_at
        FROM content
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 5
    `, [targetProfileNumericId]);
    visibleTasks = taskRes.rows;
  }

  return {
    profile: targetProfileData,
    isOwner,
    relationStatus,
    tasks: visibleTasks,
  };
};