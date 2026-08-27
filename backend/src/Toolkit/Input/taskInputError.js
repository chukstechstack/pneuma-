import AppError from "../AppError/appError.js";
export default class TaskInputError extends AppError {
    constructor(message, statusCode = 400) {
        super(message, statusCode);
        this.name = "TaskInputError";
    }
}
//# sourceMappingURL=taskInputError.js.map