const DataTypes = require('sequelize');
const sequelize = require('../database');
const bcrypt = require('bcrypt');

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
  role_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    defaultValue: 1,
    references: {
        model: 'Roles',
        key: 'id'
    }
  }
});

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true

//Table creation if does not exist
User.sync();
console.log("The table for the User model has been created if not already existed");

//Create or Find the possible Roles----
bcrypt.hash('root', 10)
.then(hash => {
  User.findOrCreate(
    {
        where: {firstname:'ADMIN'},
        defaults:{
          firstName:'ADMIN',
          lastName:'ADMIN',
          mail: 'admin@admin.com',
          password: hash,
          role_id:2}
    }
  );
})

module.exports = sequelize.models.User;