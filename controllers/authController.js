const User = require('../models/User');
const { handleErrors } = require('../helpers/handleErrors');
const { createToken } = require('../helpers/createToken');

const maxAge = 3 * 24 * 60 * 60;
const createTokenCookie = (res, token) => {
    res.cookie('token', token, {httpOnly: true, maxAge: maxAge * 1000});
}

// GET Signup Page
module.exports.signup_get = (req, res) => {
    res.render('signup');
}

// GET Login Page
module.exports.login_get = (req, res) => {
    res.render('login');
}


// POST Signup User
module.exports.signup_post = (req, res) => {
    const { name, email, password } = req.body;
    User.create({ name, email, password })
    .then((user) => {
        const token = createToken({id : user._id, name : user.name}, maxAge);
        createTokenCookie(res, token);
        res.status(201).json({user:user._id, user_name : user.name});
    })
    .catch((err) => {
        res.status(400).json(handleErrors(err));
    });
}

// POST Login User
module.exports.login_post = (req, res) => {
    const { email, password } = req.body;
    User.login(email, password)
    .then((user) => {
        const token = createToken({id : user._id, name : user.name}, maxAge);
        createTokenCookie(res, token);
        res.status(200).json({user:user._id, user_name : user.name});
    })
    .catch((err) => {
        res.status(400).json(handleErrors(err));
    });
}

module.exports.logout_get = (req, res)  => {
    res.cookie('token','', {maxAge : 1});
    res.redirect('/');
}