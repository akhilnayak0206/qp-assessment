const models = require('../database/models/index.js');

const addGrocery = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    // create a new grocery item
    const newGroceryItem = await models.GroceryItem.create({ name, price, description });

    // create a corresponding inventory entry with default quantity
    await models.GroceryInventory.create({ quantity: 0, groceryitemId: newGroceryItem.id });

    return res.status(201).json({ message: 'Grocery item added successfully', data: newGroceryItem });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const viewGroceries = async (req, res) => {
  try {
    // pagination params
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // calc the offset based on the page and page size
    const offset = (page - 1) * pageSize;

    // get paginated grocery items
    const result = await models.GroceryItem.findAndCountAll({
      offset,
      limit: pageSize,
      include: models.GroceryInventory
    });

    return res.json({
      data: result.rows,
      totalItems: result.count,
      totalPages: Math.ceil(result.count / pageSize),
      currentPage: page
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const removeGrocery = async (req, res) => {
  try {
    const itemId = req.params.id;

    // check if the grocery item exists
    const groceryItem = await models.GroceryItem.findByPk(itemId);

    if (!groceryItem) {
      return res.status(404).json({ message: 'Grocery item not found' });
    }

    // delete the grocery item and its associated inventory
    await models.GroceryItem.destroy({ where: { id: itemId } });

    return res.json({ message: 'Grocery item removed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateGrocery = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { name, price, description } = req.body;

    // update the grocery item
    const updatedGroceryItem = await models.GroceryItem.update({ name, price, description }, { where: { id: itemId } });

    // if updatedGroceryItem[0] is 0 then the grocery item was not found
    if (updatedGroceryItem[0] === 0) {
      return res.status(404).json({ message: 'Grocery item not found' });
    }

    return res.json({ message: 'Grocery item updated successfully', data: { id: itemId, name, price, description } });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const manageInventory = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { quantity } = req.body;

    // update the inventory level
    const updatedInventory = await models.GroceryInventory.update({ quantity }, { where: { groceryitemId: itemId } });

    // if updatedInventory[0] is 0 then the grocery item was not found
    if (updatedInventory[0] === 0) {
      return res.status(404).json({ message: 'Grocery item not found' });
    }

    return res.json({ message: 'Inventory level updated successfully', data: { id: itemId, quantity } });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { addGrocery, updateGrocery, viewGroceries, removeGrocery, manageInventory };
