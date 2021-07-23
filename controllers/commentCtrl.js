const GET_USERID_FROM_TOKEN = require('../middleware/util');
const Comment = require('../models/Comment');
const Post = require('../models/Post');


//Create Comment method--------
exports.newComment = async function(req, res, next) {
    if(commentValidation(req.body,res)) {
        const userId = GET_USERID_FROM_TOKEN(req);
            Comment.create({
                ...req.body,
                user_id: userId
            })
            .then(() => {
                res.status(201).json({ message: 'Commentaire créé !' })
            })
            .catch(error => {
                console.log("tata");
                return res.status(500).json({ "error": error.message })
            });  
    }
};

//Get One Comment method-------------
exports.getOneComment = async function (req,res,next) {
    Comment.findByPk(req.params.id)
    .then(comment => {
        return res.status(200).json({ comment });
    })
    .catch(error => {
        return res.status(500).json({ "error": error });
    });
};

//Get All Comments method--------------
exports.getAllComments = async function (req,res,next) {
    Comment.findAll({ order: [ ['createdAt', 'DESC'] ] })
    .then(comments => {
        return res.status(200).json({ comments });
    })
    .catch(error => {
        return res.status(500).json({ "error": error.message });
    });
};

//Get All Comments of A Post method--------------
exports.getAllCommentsOfAPost = async function (req,res,next) {
    Comment.findAll({where: { post_id:req.params.id }},{ order: [ ['createdAt', 'DESC'] ] })
    .then(comments => {
        return res.status(200).json({ comments });
    })
    .catch(error => {
        return res.status(500).json({ "error": error.message });
    });
};

//Update a Comment method-------------
exports.modifyComment = async function (req,res,next) {
    if(authorizedToModifyThisComment(req)) {
        if(commentValidation(req.body,res)) {
            const userId = GET_USERID_FROM_TOKEN(req);
            Comment.update({
                ...req.body,
                user_id: userId
                }, {where: { id:req.params.id }})
                .then(updatedRows => {
                    res.status(200).json({ message:'Commentaire mis à jour, lignes modifiées: '+updatedRows })
                })
                .catch(error => {
                    return res.status(500).json({ "error": error.message })
                });
        }
    } else {
        return res.status(500).json({ "error": "Vous n'êtes pas authorisé à modifier ou supprimer ce commentaire" });
    }
    
};

//Delete a Comment method-------------
exports.deleteOneComment = async function (req,res,next) {
    if(authorizedToModifyThisComment(req)) {
        Comment.destroy({ where: { id:req.params.id }})
        .then(deletedRows => {
            return res.status(200).json( { message: 'Commentaire supprimé, nombre de lignes supprimées: '+deletedRows});
        })
        .catch(error => {
            return res.status(500).json({ "error": error.message });
        });
    } else {
        return res.status(500).json({ "error": "Vous n'êtes pas authorisé à modifier ou supprimer ce commentaire" });
    }

};


//Functions-------------------------------------------------------
//User validation----------
function commentValidation(comment,res) {
    console.log(comment);
    if(comment.content!=null) {
        if(comment.post_id!=null) {
            return true;
        } else {
            res.status(400).json({error : "Votre commentaire doit être rattaché à un article !"});
            return false;
        } 
    } else {
        res.status(400).json({error : "Votre commentaire n'a pas de contenu !"});
        return false;
    }  
}

//Functions----------------
//Check if User is authorize to update/delete the post----
async function authorizedToModifyThisComment(req) {
    const userId = GET_USERID_FROM_TOKEN(req);
    Comment.findByPk(req.params.id)
    .then(comment => {
        return comment.user_id == userId;
    })
    .catch(error => {
        console.error(error);
        return false;
    })
};