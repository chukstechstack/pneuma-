export interface JournalTask extends Record<string, any> {
  uuid: string;
  author_profile_uuid?: string | null;
}

export interface JournalFeedPage {
  tasks: JournalTask[];
  next_post_timestamp?: string;
}

export interface JournalPageParams extends Record<string, string | undefined> {
  targetUserUuid?: string;
}