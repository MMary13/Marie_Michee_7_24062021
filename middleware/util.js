const jwt = require('jsonwebtoken');

function GET_USERID_FROM_TOKEN(req) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    return decodedToken.userId;
}

module.exports = GET_USERID_FROM_TOKEN;