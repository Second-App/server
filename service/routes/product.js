const router = require('express').Router();
const ProductController = require('../controllers/ProductController.js');
const { authenticate } = require('../middlewares/authenticate.js');
const { authorizeProduct } = require('../middlewares/authorize.js');

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);

router.patch('/sold/:id', ProductController.editSold);
router.patch('/available/:id', ProductController.editAvailable);
router.use(authenticate);

router.post('/', ProductController.createProduct);
router.get('/checkout/:id', ProductController.checkoutProduct);

router.put('/:id', authorizeProduct, ProductController.editProduct);
router.delete('/:id', authorizeProduct, ProductController.deleteProduct);

module.exports = router;
