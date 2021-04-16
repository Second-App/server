const router = require('express').Router();

router.get('/:id');
router.post('/register');
router.post('/login');
router.put('/:id');
router.patch('/:id');
router.delete('/:id');

module.exports = router;
