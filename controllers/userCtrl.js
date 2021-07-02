const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Signup User method, use bcrypt to encrypt password--------
exports.signup = async function(req, res, next) {
    if(userValidation(req.body,res)) {
        //Password encryption
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //Create new User and add to DB
            console.log('Password hashed');
            User.create({
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                mail:req.body.mail,
                password:hash,
                role_id:req.body.roleId
            })
            .then(res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(500).json({ error }));

        })
        .catch(error => res.status(500).json({ error }));
    } 
};

//Login User method, check the password and give a token access if OK-----------------
exports.login = async function(req, res, next) {
    try {
        const user = await User.findOne( {where:{ mail: req.body.mail }});
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
    } catch (error) {
        return res.status(500).json({ error })
    }
};

exports.getUserInfo = async function (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        console.log(decodedToken);
        const userId = decodedToken.userId;
        const user = await User.findByPk(userId);
        if(user === null) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'});
        } else {
            return res.status(200).json({ user });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
};

//PUT: update a user---------
exports.modifyUser = (req, res, next) => {
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
            return res.status(500).json({ error })});
    } 
};

//DELETE: delete a user---------
exports.deleteUser = async function (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        User.destroy({ where: { id:userId }});
        return res.status(200).json( { message: "L'utilisateur a été supprimé"})
    } catch (error) {
        return res.status(500).json({ error });
    }
};

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

//Functions pour Admin TO DO---------------

//-------------------------------------------


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