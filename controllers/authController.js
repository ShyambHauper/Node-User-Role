const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup
exports.signup = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    try {
        const user = new User({
            firstName,
            lastName,
            email,
            password: await bcrypt.hash(password, 10),
            role
        });
        await user.save();
        res.status(201).json({ status: true, data: null, message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ status: fasle, data: null, error: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).populate('role', 'roleName accessModules');
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ status: false, data: null, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ status: true, data: { user: user, token: token }, message: 'User login successfully' });
    } catch (err) {
        res.status(500).json({ status: fasle, data: null, error: err.message });
    }
};
