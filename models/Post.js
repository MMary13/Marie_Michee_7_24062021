const DataTypes = require('sequelize');
const sequelize = require('../database');
const Comment = require('./Comment');

const Post = sequelize.define('Post', {
  // Model attributes are defined here
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  like: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  dislike: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  user_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
        model: 'Users',
        key: 'id'
    }
  }
});

Post.hasMany(Comment, {as: 'comments'});

// `sequelize.define` also returns the model
console.log(Post === sequelize.models.Post); // true

//Table creation if does not exist
Post.sync();
console.log("The table for the Post model has been created if not already existed");

module.exports = sequelize.models.Post;