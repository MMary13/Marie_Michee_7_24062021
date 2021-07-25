const DataTypes = require('sequelize');
const sequelize = require('../database');


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


// `sequelize.define` also returns the model
console.log(Post === sequelize.models.Post); // true


module.exports = sequelize.models.Post;