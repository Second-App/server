const router = require('express').Router()

router.get('/profile/:id') 
router.post('/register')
router.post('/login')
router.put('/profile/edit/:id')
router.patch('/profile/patch/:id')
router.delete('/prodile/delete/:id')

module.exports = router