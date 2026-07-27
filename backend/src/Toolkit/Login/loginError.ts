import AppError from "../AppError/appError.js";

export default class LoginError extends AppError {
  constructor(message: string, statusCode: number = 401) {
    super(message, statusCode);
    this.name = "LoginError";
  }
}