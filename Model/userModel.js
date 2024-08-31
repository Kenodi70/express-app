const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Your Name']
    },
    email: {
        type: String,
        required: [true, 'Please Enter An Email'],
        unique: true,
        lowerCase: true,
        validator: [validator.isEmail, 'Please Enter A Valid email']
    },
    Photo: String,
    password: {
        type: String,
        required: [true, 'Please Enter A Password'],
        minLenght: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please Confirm Your Password'],
        validate: {
            validator: function (value) {
                return value == this.password
            },
            message: "Password and confirm password are not the same"
        }
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash('password', 10)
    this.confirmPassword = undefined;
    next();
})

userSchema.methods.comPassInId = async function (pswd, pswdDB) {
    return await bcrypt.compare(pswd, pswdDB)
}

const User = mongoose.model('Auth', userSchema)
module.exports = User;