import {Router} from "express";
import * as authController  from "./controller/auth.controller.js";



const authRoute = Router();

authRoute.post('/register', authController.register);
authRoute.patch('/verified-account', authController.verifiedAccount);
authRoute.post('/login', authController.login);
authRoute.post('/send-OTP', authController.sendOTP);
authRoute.patch('/reset-password', authController.resetPassword);

export default authRoute;