const DataTypes = require('sequelize');
const sequelize = require('../database');

const Role = sequelize.define('Role', {
  // Model attributes are defined here
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

console.log(Role === sequelize.models.Role);
//Table creation if does not exist
Role.sync();
console.log("The table for the Role model has been created if not already existed");

//Create or Find the possible Roles----
Role.findOrCreate(
    {
        where: {name:'USER'},
        defaults:{name:'USER', description:'USER role gives access to basic requests'}
    }
);

Role.findOrCreate(
    {
        where: {name:'ADMIN'},
        defaults:{name:'ADMIN', description:'ADMIN role gives access to basic requests and admin requests as delete or update another user'}
    }
);

module.exports = sequelize.models.Role;
