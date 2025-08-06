import express from "express";
import { register, verifyOTP } from "../controllers/user.controllers.js";
const userRouter = express.Router()

userRouter.post('/register', register);
userRouter.post('/verify-otp', verifyOTP);
userRouter.get('/register', (req, res) => {
    res.status(200).send('this is register route');
});

export default userRouter;