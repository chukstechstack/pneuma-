import AppError from "../AppError/appError";
export default class RegistrationError extends AppError {
    constructor(message: string, statusCode: number = 400){
        super(message, statusCode);
        this.name= "RegistrationError"
 }
}