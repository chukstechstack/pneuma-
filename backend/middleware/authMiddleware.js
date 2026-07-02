import TaskInputError from "../utils/taskInputError.js";

export const ensureAuthenticated = (req, res, next) => {
  if (!req.user) {
    return next(new TaskInputError("Unauthorized access, Please log in.", 401));
  }
  next();
};


