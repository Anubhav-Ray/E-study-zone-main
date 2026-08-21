const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Administrative roles are created by the college, never from the public sign-up form.
        const allowedPublicRoles = ['student', 'faculty', 'learner', 'trainer'];
        if (role && !allowedPublicRoles.includes(role)) {
            return res.status(403).json({ message: 'This role cannot be created through public registration' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                uniqueId: user.uniqueId,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
        
    }
};

// @desc    Register an administrator using the college-issued access code
// @route   POST /api/auth/register-admin
// @access  Public (protected by ADMIN_REGISTRATION_CODE)
exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password, accessCode } = req.body;
        const configuredCode = process.env.ADMIN_REGISTRATION_CODE;
        if (!configuredCode) {
            return res.status(503).json({ message: 'Admin registration is not configured yet' });
        }

        const submittedCode = Buffer.from(accessCode || '');
        const expectedCode = Buffer.from(configuredCode);
        const isValidCode = submittedCode.length === expectedCode.length && crypto.timingSafeEqual(submittedCode, expectedCode);
        if (!isValidCode) return res.status(403).json({ message: 'Invalid admin access code' });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, role: 'admin' });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            uniqueId: user.uniqueId,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && user.isActive && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                uniqueId: user.uniqueId,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password, or account is inactive' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
