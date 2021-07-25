const Post = require('./Post');
const Comment = require('./Comment');

Post.hasMany(Comment, {as: 'comments'});
Comment.belongsTo(Post);

//Table creation if does not exist
Comment.sync();
console.log("The table for the Comment model has been created if not already existed");

//Table creation if does not exist
Post.sync();
console.log("The table for the Post model has been created if not already existed");