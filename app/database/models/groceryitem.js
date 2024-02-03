'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroceryItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  GroceryItem.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      image: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT }
    },
    {
      sequelize,
      modelName: 'GroceryItem'
    }
  );
  return GroceryItem;
};
