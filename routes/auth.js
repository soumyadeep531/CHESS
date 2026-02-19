const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { forwardAuthenticated } = require('../middleware/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login', { title: 'Login' });
});

// Signup Page
router.get('/signup', forwardAuthenticated, (req, res) => {
    res.render('signup', { title: 'Sign Up' });
});

// Register Handle
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    let errors = [];

    // Basic validation
    if (!username || !email || !password) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        return res.render('signup', {
            errors,
            username,
            email,
            password,
            title: 'Sign Up'
        });
    }

    try {
        // Check if user exists
        let user = await User.findOne({ email: email });
        if (user) {
            errors.push({ msg: 'Email already exists' });
            return res.render('signup', {
                errors,
                username,
                email,
                password,
                title: 'Sign Up'
            });
        }

        user = await User.findOne({ username: username });
        if (user) {
            errors.push({ msg: 'Username already exists' });
            return res.render('signup', {
                errors,
                username,
                email,
                password,
                title: 'Sign Up'
            });
        }

        const newUser = new User({
            username,
            email,
            password
        });

        // Hashing happens in pre-save hook in model
        await newUser.save();

        req.session.userId = newUser._id;
        res.redirect('/dashboard');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Login Handle
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', {
                errors: [{ msg: 'Email is not registered' }],
                email,
                title: 'Login'
            });
        }

        // Check Password
        const isMatch = await user.comparePassword(password);
        if (isMatch) {
            req.session.userId = user._id;
            res.redirect('/dashboard');
        } else {
            res.render('login', {
                errors: [{ msg: 'Password incorrect' }],
                email,
                title: 'Login'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error(err);
        res.redirect('/login');
    });
});

module.exports = router;
