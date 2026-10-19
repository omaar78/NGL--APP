import {z} from "zod";
import {AppError} from "../Errors/Error.js";

export function validateBody(dto, body) {
       const result= z.safeParse(dto, body);
       if (result.success === false) {
           const errorMessages = result.error.issues.map(issue => `${issue.path[0]}: ${issue.message}`).join(", ");
           throw new AppError(errorMessages, 400)
       }
       return result.data;
}