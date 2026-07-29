export interface TaskData {
  content?: string | null;
  img?: string | null;
  uuid: string;
  author_name?: string | null;
  author_profile_uuid: string;
  relation_status?: string | null;
  created_at?: string | null;
  is_liked?: boolean;
  is_reposted?: boolean;
  likes_count?: number;
  comments_count?: number;
  reposts_count?: number;
}

export interface TaskProps {
  task: TaskData;
  deleteTask: (uuid: string) => void;
  isOwner: boolean;
  handle_Like_Reply_Share_Interaction: (uuid: string, action: string) => void;
  currentUserUuid: string;
  onEdit: (uuid: string) => void;
}