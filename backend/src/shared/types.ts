// shared/types.ts

export interface User {
  userUuid: string;
  email?: string;
  // Add other user fields as you build them out
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

// shared/types.ts
export interface UserUuidPayload {
  userUuid?: string;
}

export interface TaskItem {
  id: number | string;
  uuid: string;
  title: string | null;
  content: string | null;
  img: string | null;
  created_at: string | Date;
  likes_count: number;
  reposts_count: number;
  shares_count: number;
  author_name: string | null;
  avatar_url: string | null;
  author_profile_uuid: string;
  user_id: number | string;
  is_liked: boolean;
  is_reposted: boolean;
  relation_status: string | null;
  comments_count: number;
  [key: string]: unknown; // Escape hatch just in case
}