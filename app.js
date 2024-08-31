//importing express 
const express = require('express');
//it will return a function and we store it inside the variable(express)

/*the express function when called will return an object so we store that object
inside the app variable from ther we have a lot of methods to make use of */
const app = express();
const router = require('./Route/movieRoutes')
app.use(express.json())
const CustomError = require('./Utils/CustomError')
const globalErrorHandler = require('./controllers/errorControllers')
const authRoute = require('./Route/authRoute')
app.use('/movies', router);
app.use('/User', authRoute)

//Default Route error handler
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status:"FAILED",
    //     message: `The url ${req.originalUrl} is not found`
    // })
    const err = new CustomError(`The url ${req.originalUrl} is not on the server`, 404)

    next(err)

})
//Global error handling middleware
app.use(globalErrorHandler);



module.exports = app;