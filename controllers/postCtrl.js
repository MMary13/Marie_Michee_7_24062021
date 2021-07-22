const GET_USERID_FROM_TOKEN = require('../middleware/util');
const Post = require('../models/Post');


//Create Post method--------
exports.newPost = async function(req, res, next) {
    if(postValidation(req.body,res)) {
        const userId = GET_USERID_FROM_TOKEN(req);
        const postObject = req.file ?
            {
            ...req.body,
            user_id: userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : {...req.body, user_id: userId};
        Post.create(postObject)
        .then(() => {
            res.status(201).json({ message: 'Publication créée !' })
        })
        .catch(error => {
            return res.status(500).json({ "error": error.message })
        });
    }
};

//Get One Post method-------------
exports.getOnePost = async function (req,res,next) {
    Post.findByPk(req.params.id)
    .then(post => {
        return res.status(200).json({ post });
    })
    .catch(error => {
        return res.status(500).json({ "error": error.message });
    });
};

//Get All Posts method--------------
exports.getAllPosts = async function (req,res,next) {
    Post.findAll({ order: [ ['createdAt', 'DESC'] ] })
    .then(posts => {
        return res.status(200).json({ posts });
    })
    .catch(error => {
        return res.status(500).json({ "error": error.message });
    });
};

//Update a Post method-------------
exports.modifyPost = async function (req,res,next) {
    if(authorizedToModifyThisPost(req)) {
        if(postValidation(req.body,res)) {
            const userId = GET_USERID_FROM_TOKEN(req);
            const postObject = req.file ?
                {
                ...req.body,
                user_id: userId,
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } : {...req.body, user_id: userId};
            Post.update(postObject, {where: { id:req.params.id }})
                .then(updatedRows => {
                    res.status(200).json({ message:'Publication mise à jour, lignes modifiées: '+updatedRows })
                })
                .catch(error => {
                    return res.status(500).json({ "error": error.message })
                });
        }
    } else {
        return res.status(500).json({ "error": "Vous n'êtes pas authorisé à modifier ou supprimer cet article" });
    }
    
};

//Delete a Post method-------------
exports.deleteOnePost = async function (req,res,next) {
    if(authorizedToModifyThisPost(req)) {
        Post.destroy({ where: { id:req.params.id }})
        .then(deletedRows => {
            return res.status(200).json( { message: 'Publication supprimée, nombre de lignes supprimées: '+deletedRows});
        })
        .catch(error => {
            return res.status(500).json({ "error": error.message });
        });
    } else {
        return res.status(500).json({ "error": "Vous n'êtes pas authorisé à modifier ou supprimer cet article" });
    }

};


//Functions-------------------------------------------------------
//User validation----------
function postValidation(post,res) {
    console.log(post);
    if(post.title!=null) {
        if (post.content!=null) {
            return true;
        } else {
            res.status(400).json({error : "Votre Publication n'a pas de contenu !"});
        return false;
        }
    } else {
        res.status(400).json({error : "Votre Publication n'a pas de titre !"});
        return false;
    }  
}

//Functions----------------
//Check if User is authorize to update/delete the post----
function authorizedToModifyThisPost(req) {
    const userId = GET_USERID_FROM_TOKEN(req);
    Post.findByPk(req.params.id)
    .then(post => {
        return post.user_id === userId;
    })
    .catch(error => {
        console.error(error);
        return false;
    })
};