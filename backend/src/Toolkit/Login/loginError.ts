import AppError from "../AppError/appError";

export default class LoginError extends AppError {
  constructor(message: string, statusCode: number = 401) {
    super(message, statusCode);
    this.name = "LoginError";
  }
}