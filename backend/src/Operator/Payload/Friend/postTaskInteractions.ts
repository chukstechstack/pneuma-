import type { Request, Response } from 'express';
import pool from '../../../Terminal/Supabase/supabaseConfig';
import { handleToggleLike } from '../Friend/PostTaskComponents/LikeHandler';
import { handleToggleShare } from '../Friend/PostTaskComponents/ShareHandler';
import { handleAddComment } from '../Friend/PostTaskComponents//addCommentHandler';
import { handleDeleteComment } from '../Friend/PostTaskComponents/deleteCommentHandler';

type InteractionType = 'TOGGLE_LIKE' | 'TOGGLE_SHARE' | 'ADD_COMMENT' | 'DELETE_COMMENT';

interface InteractionRequestBody {
    type: InteractionType;
    payload: any;
}

interface TaskParams {
    taskUuid: string;
}

export const postTaskInteractions = async (req: Request<TaskParams, any, InteractionRequestBody>, res: Response): Promise<Response> => {
    const { taskUuid } = req.params;
    const { type, payload } = req.body;

    try {
        // 1. Resolve content numeric ID from UUID globally for post-related actions
        const contentRes = await pool.query(`SELECT id FROM content WHERE uuid = $1`, [taskUuid]);
        if (contentRes.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        const contentId = contentRes.rows[0].id;

        // 2. Dispatch to the appropriate modular handler
        if (type === 'TOGGLE_LIKE') {
            const result = await handleToggleLike(contentId, payload);
            return res.status(200).json({ success: true, message: "Like updated", ...result });
        }
        
        if (type === 'TOGGLE_SHARE') {
            const result = await handleToggleShare(contentId, payload);
            return res.status(200).json({ success: true, message: "Share updated", ...result });
        }
        
        if (type === 'ADD_COMMENT') {
            const comment = await handleAddComment(contentId, payload);
            return res.status(200).json({ success: true, message: "Comment added successfully", comment });
        }
        
        if (type === 'DELETE_COMMENT') {
            await handleDeleteComment(payload);
            return res.status(200).json({ success: true, message: "Comment deleted successfully" });
        }

        return res.status(400).json({ error: "Invalid interaction type" });
    } catch (error: any) {
        console.error("Error updating interaction:", error);
        
        // Handle specific thrown validation errors cleanly
        if (error.message.includes("not found") || error.message.includes("required")) {
            return res.status(400).json({ error: error.message });
        }

        return res.status(500).json({ error: "Failed to update interaction" });
    }
};