const express = require('express');
const router = express.Router();

const { login } = require('../controllers/authController');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', login);

router.get('/profile', authMiddleware, (req, res) => {

    res.json({
        message: 'Protected route accessed',
        user: req.user
    });

});

module.exports = router;