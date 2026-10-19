import * as authRepository from "../repository/auth.repository.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import * as otpRepository from "../repository/otp.repository.js";
import * as userRepository from "../../user/repository/user.repository.js";
import {toMs} from "../../../utils/time.js";
import * as authError from "../Errors.js";
import {userAlreadyExist, userAlreadyVerified, userNotExists, userNotVerified} from "../../user/Errors.js";
import {generateOTPCode} from "../../../utils/otp.js";
import {sendEmail} from "../../../common/email/nodemailer.js";
import {logger} from "../../../common/logger/logger.js";
import {generateToken} from "../utils/token.js";
import {comparePassword, hashPassword} from "../utils/hash.js";



export async function register(userData) {
    const userExist = await authRepository.checkUserExistByEmail(userData.email);
    if (userExist) {
        throw userAlreadyExist ;
    }
    userData.password = await hashPassword(userData.password);
    const user = await authRepository.createUser(userData);
    const code = generateOTPCode()

    logger.info(code);
    await otpRepository.createOTP({
        code: code,
        email: userData.email,
        expireAt: new Date(Date.now() + toMs(5, 'minutes'))
    })
    await sendEmail(
        userData.email,
        'verification code',
        `<h1>Your verification code ${code}</h1>`
    );
    return user;
 }

export async function verifyAccount (code, email) {
    const userExist = await authRepository.checkUserExistByEmail(email);
    if (!userExist) {
        throw userNotExists;
    }
    if (userExist.isVerified === true) {
        throw userAlreadyVerified;
    }
    const otp = await otpRepository.getOtpByEmail(email);
    if (!otp){
        throw authError.otpExpired;
    }
    if (otp.expireAt < new Date()) {
        await otpRepository.deleteOTPByEmail(email);
        throw authError.otpExpired;
    }
    if(otp.code !== code){
        throw authError.invalidCode;
     }
    const updatedUser = await userRepository.updateUserByEmail(email,{isVerified: true});
    await otpRepository.deleteOTPByEmail(email);
    return updatedUser;
}

export async function login (email, password) {
    const userExist = await authRepository.checkUserExistByEmail(email);
    if (!userExist) {
        throw userNotExists;
    }
    if (userExist.isVerified === false) {
        throw userNotVerified
    }
    const match = await comparePassword(password, userExist.password);
    if (!match) {
        throw authError.invalidPassword;
    }

    return generateToken({id: userExist._id, email: userExist.email, name: userExist.name});
}

export async function sentOTP (email) {
    const userExist = await authRepository.checkUserExistByEmail(email);
    if (!userExist) {
        throw userNotExists;
    }
    await otpRepository.deleteOTPByEmail(email);
    const code = generateOTPCode();
    await otpRepository.createOTP({
        code: code,
        email: email,
        expireAt: Date.now() + toMs(5, 'minutes')
    })
    await sendEmail(email, "new otp", `<p>Your new OTP is ${code}</p>`)
}

export async function resetPassword(email, code, newPassword) {
    const otp = otpRepository.getOtpByEmail(email);
    if (!otp){
       throw authError.otpExpired;
    }
    if (otp.code !== code ){
        throw authError.invalidCode;
    }
    await otpRepository.deleteOTPByEmail(email)
    const hashPassword = await hashPassword(newPassword);
    return  await userRepository.updateUserByEmail(email, {hashPassword: hashPassword});
}
