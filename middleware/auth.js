const jwt = require('jsonwebtoken');
const GET_USERID_FROM_TOKEN = require('./util');

//Authorization middleware---------------
module.exports = (req, res, next) => {
    try {
        const userId = GET_USERID_FROM_TOKEN(req);
        if(req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ "error": error.message});
    }
};



