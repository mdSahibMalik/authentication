import { User } from "../models/user.models.js";
import asyncErrorHandler from "./asyncErrorHandler.js";
import ErrorHandler from "./errorHandler.js";
import jwt from "jsonwebtoken";


export const isAuthenticate = asyncErrorHandler(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler('Unauthorized user ', 401));
    }

    try {
        const decodedToken =  jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = await User.findById(decodedToken.id);

        next();
    } catch (error) {
        next(error)
    }

});