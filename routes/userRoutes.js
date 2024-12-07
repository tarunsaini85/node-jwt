const { Router } = require('express');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.get('/profile', requireAuth, (req, res)  => res.render('profile'))

module.exports = router;