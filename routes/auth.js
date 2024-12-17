const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // or 'bcryptjs'
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this import is correct
const { body, validationResult } = require('express-validator');

// Regular expression for strong password validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// User Registration with Validation
router.post('/register', 
    // Validation rules
    body('username').isString().isLength({ min: 3, max: 30 }), // Username must be a string, 3-30 characters
    body('password')
        .isString()
        .matches(passwordRegex) // Checks the password against the regex
        .withMessage('Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'), // Custom error message
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Return validation errors
        }

        const { username, password } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, password: hashedPassword });
            await user.save();
            res.status(201).json({ message: 'User registered successfully!' });
        } catch (err) {
            if (err.code === 11000) { // Duplicate key error
                res.status(400).json({ error: 'Username already exists.' });
            } else {
                res.status(500).json({ error: 'An error occurred.' });
            }
        }
    }
);

const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { error: 'Too many login attempts, please try again later.' }
});

router.post('/login', loginLimiter,
    body('username').isString().isLength({ min: 3, max: 30 }),
    body('password').isString().isLength({ min: 8 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username });
            if (user && await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(400).json({ error: 'Invalid username or password.' });
            }
        } catch (err) {
            res.status(500).json({ error: 'An error occurred during login.' });
        }
    }
);
