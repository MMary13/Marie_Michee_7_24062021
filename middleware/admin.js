//Admin middleware---------------
const User = require('../models/User');
const util = require('./util');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        User.findByPk(userId)
        .then(user => {
            if(user.role_id === 2) {
                console.log('Vous êtes ADMIN');
                next();
            } else {
                console.log("Vous n'êtes pas ADMIN");
                return res.status(401).json({ error:"Vous n'avez pas l'authorisation pour cette requête" });
            }
        })
        .catch(error => {
            return res.status(500).json({ error })
        });
    } catch (error){
        res.status(500).json({ error });
    }
};