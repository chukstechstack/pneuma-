import type { Request } from "express";

export interface PatchTaskRequestParams {
  uuid: string;
}

export interface PatchTaskRequestBody {
  content?: string;
}

export interface PatchTaskResponseData {
  message: string;
  updatedTask: unknown;
}

export type AuthenticatedRequest = Request<PatchTaskRequestParams, unknown, PatchTaskRequestBody> & {
  user?: {
    id?: number | string;
    uuid?: string;
  };
};