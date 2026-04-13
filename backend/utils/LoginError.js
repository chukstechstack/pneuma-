import AppError from "./AppError.js"
export default class LoginError extends AppError {
    constructor(message, statusCode = 401){
        super(message, statusCode);
        this.name= "LoginError";
 }
}