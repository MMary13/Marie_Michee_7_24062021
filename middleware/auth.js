const jwt = require('jsonwebtoken');
const util = require('./util');

//Authorization middleware---------------
module.exports = (req, res, next) => {
    try {
        const userId = util.GET_USERID_FROM_TOKEN;
        if(req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')    
        });
    }
};



