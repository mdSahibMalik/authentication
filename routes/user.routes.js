import express from "express";
import { forgotPassword, getUser, login, logOut, register, resetPassword, verifyOTP } from "../controllers/user.controllers.js";
import { isAuthenticate } from "../middleware/isAuthenticate.js";
const userRouter = express.Router()

userRouter.post('/register', register);
userRouter.post('/verify-otp', verifyOTP);
userRouter.post('/login', login);
userRouter.post('/logout',isAuthenticate, logOut);
userRouter.get('/me',isAuthenticate, getUser);
userRouter.post('/password/forgot', forgotPassword);
userRouter.put('/password/reset/:token', resetPassword);
userRouter.get('/register', (req, res) => {
    res.status(200).send('this is register route');
});

export default userRouter;