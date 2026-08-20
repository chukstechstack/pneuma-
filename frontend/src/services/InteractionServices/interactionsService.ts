import axios from "../../api/axios";

// Interfaces for interactions matching your backend database schema
export interface InteractionComment {
    id: number; // Matches backend SERIAL integer
    task_uuid: string;
    author_name: string;
    avatar_url: string | null;
    author_profile_uuid: string;
    content: string;
    created_at: string;
}

export interface TaskInteractionsResponse {
    task_uuid: string;
    likes_count: number;
    shares_count: number;
    comments: InteractionComment[];
}

export interface ToggleLikePayload {
    userUuid: string;
}

export interface ToggleSharePayload {
    userUuid: string;
}

export interface AddCommentPayload {
    userUuid: string;
    content: string;
}

export interface DeleteCommentPayload {
    commentId: number;
}

export type PostInteractionRequestPayload = 
    | ToggleLikePayload 
    | ToggleSharePayload 
    | AddCommentPayload 
    | DeleteCommentPayload;

export interface PostInteractionResponse {
    success: boolean;
    message?: string;
    likesCount?: number;
    sharesCount?: number;
    isLiked?: boolean;
    isShared?: boolean;
    comment?: InteractionComment;
}

/**
 * 1. Fetch interactions (counts + comments) for a specific task
 */
export const fetchTaskInteractionsApi = async (
    taskUuid: string,
): Promise<TaskInteractionsResponse> => {
    try {
        const response = await axios.get(`task/${taskUuid}/interactions`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch interactions:', error);
        throw error;
    }
};

/**
 * 2. Post an interaction action (Like, Share, Add Comment, Delete Comment)
 */
export const postTaskInteractionApi = async (
    taskUuid: string,
    type: 'TOGGLE_LIKE' | 'TOGGLE_SHARE' | 'ADD_COMMENT' | 'DELETE_COMMENT',
    payload: PostInteractionRequestPayload,
): Promise<PostInteractionResponse> => {
    try {
        const response = await axios.post(`task/${taskUuid}/interactions`, {
            type,
            payload,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to post interaction:', error);
        throw error;
    }
};