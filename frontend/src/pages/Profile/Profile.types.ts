export interface InnerCircleUser {
  uuid: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
}

export interface ProfileInfo {
  id: string | number;
  first_name: string;
  last_name: string;
}

export interface ProfileQueryData {
  profile: ProfileInfo;
  tasks: any[];
  isOwner: boolean;
  relationStatus: string;
}

export interface FetchConversationResponse {
  data: { conversationId: string };
}