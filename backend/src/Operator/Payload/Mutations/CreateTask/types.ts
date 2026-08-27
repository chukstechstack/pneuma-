import type { Request } from "express";

export interface CreateTaskParams {
  [key: string]: string;
}

export interface CreateTaskRequestBody {
  content?: string;
  [key: string]: unknown;
}

export interface AuthenticatedRequest extends Request<CreateTaskParams, unknown, CreateTaskRequestBody> {
  user?: {
    id?: number | string;
    uuid?: string;
  };
}

export interface CreateTaskResponseData {
  message: string;
  newTask: unknown;
}