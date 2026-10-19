import {AppError} from "../../common/Errors/Error.js";

export const userAlreadyExist = new AppError("User Already Exist", 404);
export const userNotExists = new AppError("User Not Exists", 409);
export const userAlreadyVerified = new AppError("User Already Verified", 400);
export const userNotVerified = new AppError("User Not Verified", 403);