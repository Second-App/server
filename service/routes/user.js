const router = require('express').Router();

router.post('/register');
router.post('/login');

router.get('/:id');
router.put('/:id');
router.patch('/:id');
router.delete('/:id');

module.exports = router;
