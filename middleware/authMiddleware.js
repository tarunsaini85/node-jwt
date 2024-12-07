const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.token;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err){
                res.redirect('/login');
            }
            else{
                next();
            }
        })
    }
    else{
        res.redirect('/login');
    }
}

const checkLoggedIn = (req, res, next) => {
    const token = req.cookies.token;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err){
                res.locals.user = null;
            }
            else{
                res.locals.user = {id : decodedToken.id, name : decodedToken.name};
            }
            next();
        })
    }
    else{
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth , checkLoggedIn };