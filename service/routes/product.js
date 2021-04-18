const router = require('express').Router();
const ProductController = require('../controllers/ProductController.js');
const { authenticate } = require('../middlewares/authenticate.js');
const { authorizeProduct } = require('../middlewares/authorize.js');

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById)

router.use(authenticate);

router.post('/', ProductController.createProduct);

router.put('/:id', authorizeProduct, ProductController.editProduct);
router.patch('/sold/:id', authorizeProduct, ProductController.editSold);
router.patch(
  '/available/:id',
  authorizeProduct,
  ProductController.editAvailable
);
router.delete('/:id', authorizeProduct, ProductController.deleteProduct);

module.exports = router;
