import { Request, Response } from "express";
import pool from "@/Terminal/Supabase/supabaseConfig.js"; // Adjust path to your Supabase pool
import { getErrorMessage } from "../../Toolkit/GetErrorMessage/getErrorMessage";

export const fetchConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    // Assuming your auth middleware populates req.user or you pass user uuid
    const currentUserId = (req as any).user?.uuid || req.query.currentUserId; 
    const { recipientUuid } = req.query;

    if (!recipientUuid) {
      res.status(400).json({ error: "Recipient UUID is required" });
      return;
    }

    // Query messages where either user is sender and the other is recipient
    const query = `
      SELECT id, sender_uuid AS "senderUuid", content, created_at AS "createdAt"
      FROM messages
      WHERE (sender_uuid = $1 AND recipient_uuid = $2)
         OR (sender_uuid = $2 AND recipient_uuid = $1)
      ORDER BY created_at ASC;
    `;

    const { rows } = await pool.query(query, [currentUserId, recipientUuid]);

    res.status(200).json({ messages: rows });
  } catch (err: unknown) {
    console.error("❌ Error fetching conversation:", getErrorMessage(err));
    res.status(500).json({ error: "Failed to fetch conversation history" });
  }
};