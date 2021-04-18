const router = require('express').Router();
const CategoryController = require('../controllers/CategoryController.js');

router.get('/', CategoryController.getCategory);
router.get('/:id', CategoryController.getCategoryById);

module.exports = router;
