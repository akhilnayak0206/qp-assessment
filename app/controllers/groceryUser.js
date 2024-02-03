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

module.exports = {
  viewAvailableGroceries
};
