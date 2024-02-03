const { Router } = require('express');
const { authMiddleware } = require('../middleware/auth');
const { userValidator, groceryUserValidator } = require('../validators');
const { userController, groceryUserController } = require('../controllers');
const adminRoutes = require('./admin');

const router = Router();

router.get('/', (req, res) => res.send('Welcome'));

// register
router.post('/register', userValidator.registerUserValidator, userController.registerUser);
// login
router.post('/login', userValidator.loginUserValidator, userController.loginUser);

// auth middleware
router.use(authMiddleware);

// user routes
// view the list of avl grocery items with pagination
router.get('/view-groceries', groceryUserValidator.validateViewAvailableGroceries, groceryUserController.viewAvailableGroceries);
// add grocery items to cart
router.post('/add-to-cart', groceryUserValidator.addToCartValidator, groceryUserController.addToCart);
// create an order
router.post('/create-order', groceryUserController.createOrder);

// admin routes
router.use('/admin/', adminRoutes);

module.exports = router;
