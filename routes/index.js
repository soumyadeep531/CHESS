const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../middleware/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => {
    res.render('index', { title: 'Home' });
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        title: 'Dashboard',
        user: res.locals.user
    });
});

module.exports = router;
