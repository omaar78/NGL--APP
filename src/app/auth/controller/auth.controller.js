import * as authService from '../service/auth.service.js';
import {toMs} from "../../../utils/time.js";
import {loginDTO, registerDTO, resetPasswordDTO, sendDTO, verifyAccountDTO} from "../dto/auth.dto.js";
import {validateBody} from "../../../common/validation/validation.js";

export async function register (req, res, next) {
    try{
        const data = validateBody(registerDTO, req.body)
        const creatUser = await authService.register(data);

        res.status(201).json({
            'message': 'User created  successfully',
            'success': true,
            'data': creatUser
        });

    }catch(err){
        return next(err);
    }
}

export async function verifiedAccount (req, res, next) {
    try{
        const data = validateBody(verifyAccountDTO, req.body);
        const {email, code} = data;
        const updatedUser = await authService.verifyAccount(email, code);
        res.status(201).json({
            'message': 'User verified  successfully',
            'success': true,
            'data': updatedUser
        })
    }catch (error){
        return next(error);
    }
}

export async function login (req, res, next) {
    try{
        const data = validateBody(loginDTO, req.body);
        const {email, password} = data;
        const token = await authService.login(email, password);
        res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: toMs(1, 'hours'),
        });
        res.status(201).json({
            'message': 'User login  successfully',
            'success': true,
        })
    }catch (error){
        return next(error);
    }
}

export async function sendOTP (req, res, next) {
    try{
        const data = validateBody(sendDTO)
        const{email} = data;
        await authService.sentOTP(email);
        res.status(201).json({
            'message': 'New OTP sent,check user email',
            'success': true,
        })
    }catch (error){
        return next(error);
    }
}

export async function resetPassword (req, res, next) {
    try {
        const data = validateBody(resetPasswordDTO, req.body);
        const {email,code , newPassword} = data;
        await authService.resetPassword(email, code , newPassword);
        res.status(201).json({
            'message': 'User resetPassword  successfully',
            'success': true,
        })
    }catch (error){
        return next(error);
    }
}
