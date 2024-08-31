const CustomError = require("../Utils/CustomError")

const devErrors = (res, error) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error: error
    })
}

const prodErrors = (res, error) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        })
    } else {
        res.status(500).json({
            status: "error",
            message: "something went wrong with your code! try again later"
        })
    }
}

const castErrorHandler = (err) => {
    const msg = `Invalid value ${err.value} for field ${err.path}`
    return new CustomError(msg, 400)
}

const duplicateKeyErrorHandler = (err) => {

    const name = err.keyValue.name
    const msg = `${name} - already exist, please use another name`
    return new CustomError(msg, 400)
}

const validationErrorHandler= (err)=>{
    const er = Object.values(err.errors).map(val => val.message)
    const errorMessages = er.join(', ');
    const msg = `invalid input data: ${errorMessages}`;
    return new CustomError(msg, 400)
}


module.exports = (error, req, res, next) => {

    error.statusCode = error.statusCode || 500
    error.status = error.status || 'Error 500: Internal server'


    if (process.env.NODE_ENV === 'production') {

        if (error.name === 'CastError') error = castErrorHandler(error)
        if (error.code === 11000){
             error = duplicateKeyErrorHandler(error)
            }
            if(error.name ==='ValidationError')error = validationErrorHandler(error)
        prodErrors(res, error)

    } else if (process.env.NODE_ENV === 'development') {
        devErrors(res, error)
    }
}