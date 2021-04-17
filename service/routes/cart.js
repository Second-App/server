const router = require('express').Router();
const CartController = require('../controllers/CartController.js');
const { authenticate } = require('../middlewares/authenticate.js');
const { authorizeCart } = require('../middlewares/authorize.js');

router.use(authenticate);

router.post('/', CartController.createCard);
router.get('/', CartController.getCart);

router.use('/:id', authorizeCart);

router.delete('/:id', CartController.deleteCart);

module.exports = router;
