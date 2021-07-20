const DataTypes = require('sequelize');
const sequelize = require('../database');
const bcrypt = require('bcrypt');
const UsersHasFriends = require('./UsersHasFriends');

const User = sequelize.define('User', {
  // Model attributes are defined here
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mail: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userRole: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USER',
    references: {
        model: 'Roles',
        key: 'name'
    }
  }
});



// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true

//Table creation if does not exist
User.sync();
console.log("The table for the User model has been created if not already existed");

//User.belongsToMany(User,{through: UsersHasFriends, as:'Friends', foreignKey: 'friendId'});

//Create or Find the possible Roles----
bcrypt.hash('Root2021!', 10)
.then(hash => {
  User.findOrCreate(
    {
        where: {firstname:'ADMIN'},
        defaults:{
          firstName:'ADMIN',
          lastName:'ADMIN',
          mail: 'admin@admin.com',
          password: hash,
          userRole: 'ADMIN'}
    }
  );
})

module.exports = sequelize.models.User;