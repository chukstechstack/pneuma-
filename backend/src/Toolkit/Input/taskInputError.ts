import AppError from "../AppError/appError";

export default class TaskInputError extends AppError {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode);
    this.name = "TaskInputError";
  }
}