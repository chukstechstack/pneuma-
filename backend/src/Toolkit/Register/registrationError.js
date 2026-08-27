import AppError from "../AppError/appError.js";
export default class RegistrationError extends AppError {
    constructor(message, statusCode = 400) {
        super(message, statusCode);
        this.name = "RegistrationError";
    }
}
//# sourceMappingURL=registrationError.js.map