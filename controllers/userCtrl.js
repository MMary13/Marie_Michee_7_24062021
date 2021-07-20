const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const GET_USERID_FROM_TOKEN = require('../middleware/util');
const operator = require('sequelize').Op;

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
                    ...req.body,
                    password:hash,

                }
            })
            .then(([user, created]) => {
                if(created) {
                    res.status(201).json({ message: 'Utilisateur créé !' })
                } else {
                    res.status(403).json({ error: 'Un compte existe déjà pour cet email : '+user.mail })
                }
                
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ "error": error.message })
            });
        })
        .catch(error => {
            return res.status(500).json({ "error": error.message })
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
            return res.status(500).json({ "error": error.message })
        });
   
};

exports.getMyProfil = async function (req, res, next) {
    const userId = GET_USERID_FROM_TOKEN(req);
    console.log(userId);
    findUserById(userId,res);
};

//PUT: update a user---------
exports.modifyMyProfil = (req, res, next) => {
    if(userValidation(req.body,res)) {
        //Password encryption
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //Create new User and add to DB
            const userId = GET_USERID_FROM_TOKEN(req);
            updateUserById(userId,req.body,hash,res);
        })
        .catch(error => {
            return res.status(500).json({ "error": error.message })
        });
    } 
};

//DELETE: delete a user---------
exports.deleteMyProfil = async function (req, res, next) {
    const userId = GET_USERID_FROM_TOKEN(req);
    deleteUserById(userId,res);
};

//Functions for ADMIN routes---------------
//GET: Get User by Id---------------------------
exports.getUserInfo = async function(req,res,next) {
    const userId = req.params.id;
    findUserById(userId,res);
};

//GET: Get all Users-------------------------
exports.getAllUsers = async function(req,res,next) {
    const adminId = GET_USERID_FROM_TOKEN(req);
    User.findAll({ where: { id: { [operator.ne]: adminId } }})
    .then(users => {
        return res.status(200).json({ users });
    })
    .catch(error => {
        return res.status(500).json( { "error": error.message });
    })
};

//PUT: Modify a User-------------------------
exports.modifyUser = async function(req,res,next) {
    if(userValidation(req.body,res)) {
        //Password encryption
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //Create new User and add to DB
            updateUserById(req.params.id,req.body,hash,res);
        })
        .catch(error => {
            return res.status(500).json({ "error": error.message })
        });
    } 
};

//DELETE: Delete a User---------------------
exports.deleteUser = async function(req,res,next) {
    deleteUserById(req.params.id,res);
};

//-------------------------------------------

//Functions-------------------------------------------------------
//User validation----------
function userValidation(user,res) {
    console.log(user);
    if((user.firstName!=null) && (user.lastName!=null)) {
        if(emailValidation(user.mail)){
            if (passwordValidation(user.password)) {
                return true;
            } else {
                res.status(400).json({error : 'Votre mot de passe doit contenir au minimum 8 caractères, 1 majuscule, 1 minuscule, un chiffre et un caractère spécial.'})
                return false;
            }
        }else {
            res.status(400).json({error : "Votre email est incorrect, il doit être de la forme machin@bidule.truc"})
            return false;
        }
    } else {
        res.status(400).json({error : "Votre Nom ou votre Prénom est manquant"});
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

//Find a User by ID---------------------
async function findUserById(id,res) {
    User.findByPk(id)
    .then(user => {
        if(user === null) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'});
        } else {
            return res.status(200).json({ user });
        }
    })
    .catch(error => {
        return res.status(500).json({ "error": error.message });
    });
}

//Update a User by ID-----------------
async function updateUserById(id,body,hash,res) {
    User.update({
        ...body,
        password:hash
    }, {where: { id:id }})
    .then(updatedRows => {
        res.status(200).json({ message:'Profil mis à jour, lignes modifiées: '+updatedRows })
    })
    .catch(error => {
        return res.status(500).json({ "error": error.message })
    });
}

//Delete User by ID-------------------
async function deleteUserById(id,res) {
    User.destroy({ where: { id:id }})
        .then(deletedRows => {
            return res.status(200).json( { message: 'Profil supprimé, nombre de lignes supprimées: '+deletedRows})
        })
        .catch(error => {
            return res.status(500).json({ "error": error.message })
        });
}