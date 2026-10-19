import {AppError} from "../../common/Errors/Error.js";

export const otpExpired = new AppError("OTP Expired, please resend OTP", 404)
export const invalidCode = new AppError("Invalid Code", 400);
export const invalidPassword = new AppError("Invalid Password", 403);