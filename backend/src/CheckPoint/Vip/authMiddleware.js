import TaskInputError from "@/Toolkit/Input/taskInputError.js";
export const ensureAuthenticated = (req, res, next) => {
    if (!req.user) {
        return next(new TaskInputError("Unauthorized access, Please log in.", 401));
    }
    next();
};
//# sourceMappingURL=authMiddleware.js.map