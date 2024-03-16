const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authenticatingUser = async (req, res, next) => {
    // check header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        // Call next with the UnauthenticatedError instead of throwing it
        return next(new UnauthenticatedError('Authentication invalid'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // attach payload data to req.user
        req.user = { userId: payload.userId, username: payload.name ,email:payload.email };
        next();
    } catch (error) {
        // Call next with the UnauthenticatedError instead of throwing it
        next(new UnauthenticatedError('Authentication Invalid'));
    }
};

module.exports = {
    AUTHENTICATION: authenticatingUser
};