const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Name is required'],
    },
    email : {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate : [validator.isEmail, 'Please enter a valid email'],
    },
    password : {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    }
})

userSchema.pre('save', function(next){
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt);
    next();
})

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({email})
    if(user){
        const passwordMatched = bcrypt.compareSync(password, user.password)
        if(passwordMatched){
                return user;
        }
        else{ throw Error('Incorrect password') }
    }
    else{
        throw Error('Incorrect email');
    }
}

module.exports = mongoose.model('user', userSchema);