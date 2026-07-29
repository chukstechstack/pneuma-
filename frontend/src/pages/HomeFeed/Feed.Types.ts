import { TaskItem } from "@shared/types";

export interface HomeFeedResponse {
  tasks: TaskItem[];
  next_post_timestamp?: string | null;
}