const DataTypes = require('sequelize');
const sequelize = require('../database');

const UsersHasFriend = sequelize.define('UserHasFriend', {
    // Model attributes are defined here
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
      },
      friendId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
      }
});

// UsersHasFriend.associate = function(models) {
//     UsersHasFriend.belongsTo(models.Users, { as: 'Friend', onDelete: 'CASCADE'});
//     UsersHasFriend.belongsTo(models.Users, { as: 'User', onDelete: 'CASCADE' });
//   };

UsersHasFriend.sync();