const jwt = require('jsonwebtoken');

module.exports.GET_USERID_FROM_TOKEN = function() {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    return decodedToken.userId;
};