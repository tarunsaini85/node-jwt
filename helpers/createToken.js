const jwt = require('jsonwebtoken');

const createToken = (payload,maxAge) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 3 * 24 * 60 * 60
    });
}

module.exports = { createToken };