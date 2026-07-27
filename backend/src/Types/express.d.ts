import { UserProfile } from "../../Workshop/Vip/passportService.js";

declare global {
  namespace Express {
    interface User extends UserProfile {}
  }
}