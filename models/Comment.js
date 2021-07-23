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
  post_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
        model: 'Posts',
        key: 'id'
    }
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

// `sequelize.define` also returns the model
console.log(Comment === sequelize.models.Comment); // true


module.exports = sequelize.models.Comment;