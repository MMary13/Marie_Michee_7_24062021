const DataTypes = require('sequelize');
const sequelize = require('../database');

const Comment = sequelize.define('Comment', {
  // Model attributes are defined here
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
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
  },
  post_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
        model: 'Posts',
        key: 'id'
    }
  }
});



// `sequelize.define` also returns the model
console.log(Comment === sequelize.models.Comment); // true

//Table creation if does not exist
Comment.sync();
console.log("The table for the Comment model has been created if not already existed");

module.exports = sequelize.models.Comment;