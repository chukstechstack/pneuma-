import { Request, Response } from "express";
import pool from "@/Terminal/Supabase/supabaseConfig.js";
import { getErrorMessage } from "../../Toolkit/GetErrorMessage/getErrorMessage";

export const fetchConversationsList = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = (req as any).user?.uuid || (req as any).user?.id;

    if (!currentUserId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // SQL Window function to get the latest message per conversation partner
    const query = `
      WITH RankedMessages AS (
        SELECT 
          id,
          content,
          created_at,
          sender_uuid,
          recipient_uuid,
          CASE 
            WHEN sender_uuid = $1 THEN recipient_uuid 
            ELSE sender_uuid 
          END AS partner_uuid,
          ROW_NUMBER() OVER (
            PARTITION BY CASE WHEN sender_uuid = $1 THEN recipient_uuid ELSE sender_uuid END 
            ORDER BY created_at DESC
          ) as rn
        FROM messages
        WHERE sender_uuid = $1 OR recipient_uuid = $1
      )
      SELECT 
        rm.id,
        rm.content,
        rm.created_at AS "createdAt",
        p.uuid AS "partnerUuid",
        p.full_name AS "partnerName",
        p.avatar_url AS "partnerAvatarUrl"
      FROM RankedMessages rm
      JOIN profiles p ON p.uuid = rm.partner_uuid
      WHERE rm.rn = 1
      ORDER BY rm.created_at DESC;
    `;

    const { rows } = await pool.query(query, [currentUserId]);
    res.status(200).json({ conversations: rows });
  } catch (err: unknown) {
    console.error("❌ Error fetching conversations list:", getErrorMessage(err));
    res.status(500).json({ error: "Failed to fetch conversations list" });
  }
};