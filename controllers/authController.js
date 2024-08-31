const User = require('../Model/userModel')
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const CustomError = require('../Utils/CustomError');

//creating the JWT
const signToken = id =>{
    return jwt.sign({ id }, process.env.SECRET_STR,
        { expiresIn: process.env.EXPIRES })
}

// Signing up a new user
exports.signUp = asyncErrorHandler(async (req, res, next) => {

    const newUser = await User.create(req.body)

    const token = signToken(newUser._id)

    res.status(201).json({
        status: "Success",
        token,
        data: {
            user: newUser
        }
    })
})

//Logging in a user
exports.login = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body
    // const email = req.body.email
    // const password = req.body.password

    //checking if the user provided both the password and email
    if(!email || !password){
        const error = new CustomError('Please Provide valid email and password' , 400);
        return next(error)
    }

    const user = await User.findOne({ email }).select("+password")

    //using the instance of our bcrypt compare method in our userSchema 
    const isMatch = await user.comPassInId(password, user.password)
    
    console.log(isMatch)
    
    //checking if the email and password match any one in our database
    if(!user || !(await user.comPassInId(password, user.password))){
        const error = new CustomError('Incorrect email and password', 400)
        return next(error)
    }
    
    const token = signToken(user._id)

    res.status(200).json({
        status: "success",
        token:"",
    })
})