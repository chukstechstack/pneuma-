import TaskInputError from "@/Toolkit/Input/taskInputError.js";
import type { Request, Response, NextFunction } from "express";

export const ensureAuthenticated = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  if (!req.user) {
    return next(new TaskInputError("Unauthorized access, Please log in.", 401));
  }
  
  next();
};