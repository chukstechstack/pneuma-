import type { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id?: number | string;
    uuid?: string;
  };
}

export interface UpdateAvatarResponseData {
  message: string;
  avatar_url: string;
  profile: unknown;
}