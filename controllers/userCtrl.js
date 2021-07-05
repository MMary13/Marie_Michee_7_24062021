const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('../middleware/util');

//Signup User method, use bcrypt to encrypt password--------
exports.signup = async function(req, res, next) {
    if(userValidation(req.body,res)) {
        //Password encryption
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //Create new User and add to DB
            User.findOrCreate({
                where: {firstname:req.body.firstName},
                defaults:{
                    firstName:req.body.firstName,
                    lastName:req.body.lastName,
                    mail:req.body.mail,
                    password:hash,
                    role_id:req.body.roleId
                }
            })
            .then(([user, created]) => {
                if(created) {
                    res.status(201).json({ message: 'Utilisateur créé !' })
                } else {
                    res.status(403).json({ error: 'Un compte existe déjà pour cet email : '+user.mail })
                }
                
            })
            .catch(error => res.status(500).json({ error }));

        })
        .catch(error => {
            return res.status(500).json({ error })
        });
    } 
};

//Login User method, check the password and give a token access if OK-----------------
exports.login = async function(req, res, next) {
        User.findOne( {where:{ mail: req.body.mail }})
        .then(user => {
            if(user === null) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            } else {
                bcrypt.compare(req.body.password,user.password)
                .then(valid => {
                    if(!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !'});
                    }
                    return res.status(200).json({
                        userId: user.id,
                        token: jwt.sign(
                            {userId: user.id},
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn: '24h'}
                        )
                    });
                })
            }
        })
        .catch(error => {
            return res.status(500).json({ error })
        });
   
};

exports.getMyProfil = async function (req, res, next) {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        console.log("USERID= "+userId);
        User.findByPk(userId)
        .then(user => {
            if(user === null) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            } else {
                return res.status(200).json({ user });
            }
        })
        .catch(error => {
            return res.status(500).json({ error })
        });
};

//PUT: update a user---------
exports.modifyMyProfil = (req, res, next) => {
    if(userValidation(req.body,res)) {
        //Password encryption
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //Create new User and add to DB
            User.update({
                lastName:req.body.lastName,
            }, {where: { id:req.body.id }})
            .then(result => res.status(200).json(result))
            .catch(error => {
                return res.status(500).json({ error })
            });
        })
        .catch(error => {
            return res.status(500).json({ error })
        });
    } 
};

//DELETE: delete a user---------
exports.deleteMyProfil = async function (req, res, next) {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        User.destroy({ where: { id:userId }})
        .then(result => {
            return res.status(200).json( { message: "L'utilisateur a été supprimé"})
        })
        .catch(error => {
            return res.status(500).json({ error })
        });
};

//Functions for ADMIN routes---------------
exports.getUserInfo = async function(req,res,next) {
    const userId = req.body.id;
    User.findByPk(userId)
    .then(user => {
        if(user === null) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'});
        } else {
            return res.status(200).json({ user });
        }
    })
    .catch(error => {
        return res.status(500).json({ error })
    });

};

exports.modifyUser = async function(req,res,next) {};

exports.deleteUser = async function(req,res,next) {};

//-------------------------------------------

//Functions-------------------------------------------------------
//User validation----------
function userValidation(user,res) {
    if(emailValidation(user.mail)){
        if (passwordValidation(user.password)) {
            return true;
        } else {
            res.status(400).json({error : 'Votre mot de passe doit contenir au minimum 8 caractères, 1 majuscule, 1 minuscule, un chiffre et un caractère spécial.'})
            return false;
        }
    }else {
        res.status(400).json({error : "Votre email n'est pas correct, il doit être de la forme machin@bidule.truc"})
        return false;
    }
}


//Password validation-------
function passwordValidation(password){
    const pswdRegex =/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,30}$/;
    if (password.match(pswdRegex)) {
      return true;
    } else {
      return false;
    }
}

//Email validation--------
function emailValidation(email) {
    const emailRegex =/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(emailRegex)) {
      return true;
    } else {
      return false;
    }
}