import pool from "@/Terminal/Supabase/supabaseConfig";
import type { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest<P = Record<string, any>> extends Request<P> {
  user?: {
    id: number | string;
  };
}

interface SmartProfileFeedParams {
  targetProfileUuid?: string;
}

interface ProfileRow {
  id: number | string;
  uuid: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string | Date;
}

interface FollowRow {
  status: string;
}

interface TaskRow {
  id: number | string;
  uuid: string;
  content: string | null;
  img: string | null;
  created_at: string | Date;
}

interface SmartProfileFeedResponseData {
  profile: ProfileRow;
  isOwner: boolean;
  relationStatus: string | null;
  tasks: TaskRow[];
}

export const getSmartProfileFeed = async (
  req: AuthenticatedRequest<SmartProfileFeedParams>,
  res: Response,
  next: NextFunction
) => {
  const loggedInUserProfileId = req.user?.id;
  const { targetProfileUuid } = req.params;

  if (!loggedInUserProfileId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    let profileRes;

    if (targetProfileUuid && targetProfileUuid !== "undefined" && targetProfileUuid !== "me") {
      profileRes = await pool.query<ProfileRow>(
        `SELECT id, uuid, username, first_name, last_name, avatar_url, created_at 
         FROM profiles WHERE uuid = $1`,
        [targetProfileUuid]
      );
    } else {
      profileRes = await pool.query<ProfileRow>(
        `SELECT id, uuid, username, first_name, last_name, avatar_url, created_at 
         FROM profiles WHERE id = $1`,
        [loggedInUserProfileId]
      );
    }

    if (profileRes.rows.length === 0) {
      return res.status(404).json({ error: "Sanctuary profile not found" });
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
        relationStatus = 'active';
      }
    }

    if (isOwner || relationStatus === 'active') {
      const taskRes = await pool.query<TaskRow>(`
          SELECT id, uuid, content, img, created_at
          FROM content
          WHERE user_id = $1
          ORDER BY created_at DESC
          LIMIT 5
      `, [targetProfileNumericId]);
      visibleTasks = taskRes.rows;
    }

    const responseData: SmartProfileFeedResponseData = {
      profile: targetProfileData,
      isOwner,
      relationStatus,
      tasks: visibleTasks
    };

    return res.json(responseData);

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("❌ Error inside getSmartProfileFeed:", errorMessage);
    next(err);
  }
};