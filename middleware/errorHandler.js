class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message),
        this.statusCode = statusCode
    }
}
export const errorMiddleware = (err, req, res, next) =>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal server error.';

    if(err.name === 'CastError'){
        const message = `Invalid ${err.path}`
        err = new errorHandler(message, 400);
    }

    if(err.name === 'JsonWebTokenError'){
        const message = `Json Web Token is Invalid Try again.`
        err = new errorHandler(message, 400);
    }

    if(err.name === 'TokenExpiredError'){
        const message = `Json Web Token is Expired Try again`
        err = new errorHandler(message, 400);
    }

    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new errorHandler(message, 400);
    }

    return res.status(err.statusCode).json({
        success: true,
        message : err.message,
    })
}

export default ErrorHandler