const { Router } = require('express');
const { groceryAdminValidator } = require('../validators');
const { checkAdminMiddleware } = require('../middleware/auth');
const groceryAdminController = require('../controllers/').groceryAdminController;

const router = Router();

// check if user is admin
router.use(checkAdminMiddleware);

// grocery items
// add new grocery items to the system
router.post('/add-grocery', groceryAdminValidator.validateAddGrocery, groceryAdminController.addGrocery);
// view existing grocery items
router.get('/view-groceries', groceryAdminValidator.validateViewGroceries, groceryAdminController.viewGroceries);
// remove grocery items from the system
router.delete('/remove-grocery/:id', groceryAdminController.removeGrocery);
// update details of existing grocery items
router.put('/update-grocery/:id', groceryAdminValidator.validateUpdateGrocery, groceryAdminController.updateGrocery);
// manage inventory levels of grocery items
router.put('/manage-inventory/:id', groceryAdminValidator.validateManageInventory, groceryAdminController.manageInventory);

module.exports = router;
