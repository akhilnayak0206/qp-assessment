'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroceryInventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GroceryInventory.belongsTo(models.GroceryItem, {
        foreignKey: 'groceryitemId',
        onDelete: 'CASCADE'
      });
      models.GroceryItem.hasOne(models.GroceryInventory, {
        foreignKey: 'groceryitemId',
        onDelete: 'CASCADE'
      });
    }
  }
  GroceryInventory.init(
    {
      quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
      groceryitemId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'GroceryInventory'
    }
  );
  return GroceryInventory;
};
