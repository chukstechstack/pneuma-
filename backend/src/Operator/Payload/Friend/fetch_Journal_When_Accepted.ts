import pool from "@/Terminal/Supabase/supabaseConfig";
import type { Request, Response } from "express";

interface FetchJournalRequestParams {
  targetProfileUuid: string;
}

interface TaskRow {
  id: number | string;
  uuid: string;
  title: string | null;
  content: string | null;
  img: string | null;
  created_at: string | Date;
}

interface FetchJournalResponseData {
  tasks: TaskRow[];
}

export const fetch_Journal_When_Accepted = async (
  req: Request<FetchJournalRequestParams>,
  res: Response
) => {
  try {
    const { targetProfileUuid } = req.params;

    const taskRes = await pool.query<TaskRow>(`
        SELECT id, uuid, title, content, img, created_at 
        FROM content WHERE user_id = (SELECT id FROM profiles WHERE uuid = $1)
        ORDER BY created_at DESC LIMIT 5`, 
        [targetProfileUuid]
    );

    const responseData: FetchJournalResponseData = { 
      tasks: taskRes.rows 
    };

    return res.json(responseData);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("❌ ERROR IN [fetch_Journal_When_Accepted]:", errorMessage);
    return res.status(500).json({ error: `Server error: ${errorMessage}` });
  }
};