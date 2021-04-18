const router = require('express').Router();
const TypeController = require('../controllers/TypeController.js');

router.get('/', TypeController.getTypes);
router.get('/:id', TypeController.getProductsByTypeId);

module.exports = router;
