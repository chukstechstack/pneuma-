export interface Task {
  uuid: string;
  content: string;
  img?: string | null;
}

export interface PaginatedTasks {
  pages: Array<{ tasks: Task[] }>;
}

export interface FormState {
  content: string;
  img: File | null;
}