const { Sequelize } = require('../database/models/index.js');
const models = require('../database/models/index.js');

const viewAvailableGroceries = async (req, res) => {
  try {
    // pagination params
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // calc the offset based on the page and page size
    const offset = (page - 1) * pageSize;

    // get avl grocery items with quantity more than 0
    const result = await models.GroceryItem.findAndCountAll({
      include: [
        {
          model: models.GroceryInventory,
          where: { quantity: { [Sequelize.Op.gt]: 0 } } // only include items with qty > 0
        }
      ],
      offset,
      limit: pageSize
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

const addToCart = async (req, res) => {
  try {
    const { groceryItemId, quantity } = req.body;

    // check if grocery item exists and if qty is avl in inventory
    const groceryItem = await models.GroceryItem.findByPk(groceryItemId, {
      include: models.GroceryInventory
    });

    if (!groceryItem || groceryItem.GroceryInventory.quantity < quantity) {
      return res.status(400).json({ message: 'Invalid grocery item or quantity out of stock' });
    }

    // get the userId from the req obj
    const userId = req.user.userId;

    // Check if the item is already in the cart
    const existingCartItem = await models.CartItem.findOne({
      where: { userId, groceryItemId }
    });

    if (existingCartItem) {
      // update the qty if the item is already in the cart
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
    } else {
      // add the item to the cart if it's not already there
      await models.CartItem.create({ userId, groceryItemId, quantity });
    }

    return res.status(200).json({ message: 'Item added to cart successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const createOrder = async (req, res) => {
  const { userId } = req.user;

  try {
    // start transaction
    await models.sequelize.transaction(async (transaction) => {
      // Step 1: create order
      const order = await models.Order.create({ userId, status: 'pending' }, { transaction });

      // Step 2: get items from the user's cart
      const cartItems = await models.CartItem.findAll({
        where: { userId },
        include: [{ model: models.GroceryItem }],
        transaction
      });

      // if the cart is empty, send an error response
      if (cartItems.length === 0) {
        throw new Error('Cart is Empty');
      }

      // Step 3: check and update the qty of each item in the cart
      const insufficientQuantityItems = [];

      // loop through each item in the cart and then add in order items
      for (const cartItem of cartItems) {
        const inventory = await models.GroceryInventory.findOne({
          where: { groceryitemId: cartItem.groceryItemId },
          transaction
        });

        if (!inventory || inventory.quantity < cartItem.quantity) {
          // if not enough qty, add to the list of insufficient qty items
          insufficientQuantityItems.push(cartItem.groceryItemId);
        } else {
          // update qty of grocery item in inventory
          inventory.quantity -= cartItem.quantity;
          await inventory.save({ transaction });

          // create OrderItem
          await models.OrderItem.create(
            {
              orderId: order.id,
              groceryItemId: cartItem.groceryItemId,
              quantity: cartItem.quantity
            },
            { transaction }
          );
        }
      }

      // if there are insufficient qty items send an err res
      if (insufficientQuantityItems.length > 0) {
        throw new Error('One or more items do not exist or have insufficient quantity.');
      }

      // Step 4: remove items from CartItem table
      await models.CartItem.destroy({ where: { userId }, transaction });
    });

    return res.status(200).json({ message: 'Order placed successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message, error: 'Error' });
  }
};

module.exports = {
  viewAvailableGroceries,
  addToCart,
  createOrder
};
