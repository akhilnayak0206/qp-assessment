'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  User.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: {
            msg: 'Must be a valid email address'
          }
        }
      },
      password: { type: DataTypes.STRING, allowNull: false },
      role: {
        type: DataTypes.ENUM,
        values: ['admin', 'user'],
        defaultValue: 'user'
      }
    },
    {
      sequelize,
      modelName: 'User'
    }
  );
  return User;
};
