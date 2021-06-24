//const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Signup User method, use bcrypt to encrypt password--------
exports.signup = (req, res, next) => {
    if(userValidation(req.body,res)) {
        //Password encryption
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //Create new User and add to DB
            
            res.status(201).json({ message: 'Utilisateur créé !' })

        })
        .catch(error => res.status(500).json({ error }));
    } 
};

//Login User method, check the password and give a token access if OK-----------------
exports.login = (req, res, next) => {

};

//PUT: update a user---------
exports.modifyUser = (req, res, next) => {};

//DELETE: delete a user---------
exports.deleteUser = (req, res, next) => {};

//Functions-------------------------------------------------------
//User validation----------
function userValidation(user,res) {
    if(emailValidation(user.email)){
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