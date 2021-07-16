const DataTypes = require('sequelize');
const sequelize = require('../database');

const DirectMessage = sequelize.define('DirectMessage', {
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
console.log(DirectMessage === sequelize.models.DirectMessage); // true

//Table creation if does not exist
DirectMessage.sync();
console.log("The table for the DirectMessage model has been created if not already existed");

module.exports = sequelize.models.DirectMessage;