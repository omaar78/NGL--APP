import {config} from 'dotenv';
import "./common/db/mongoose.js";
import express from 'express';
import authRoute from "./app/auth/auth.route.js";
import userRoute from "./app/user/user.route.js";
import messageRoute from "./app/message/message.route.js";
import {logger} from "./common/logger/logger.js";
config()


const app = express();

app.use(express.json());

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/message', messageRoute)

app.use((err, req, res, next)=>{
    logger.error(err.message, err);
    if(err.isOperational === true){
        return res.status(err.statusCode).json({
            message: err.message,
            success: false
        });
    }
    return res.status(500).json({
        message: "Something went wrong",
        success: false,
    });
})

app.listen(3000, () =>
        logger.info('Server is running on port 3000')
);