const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    try {
        // Check if the Authorization header is present
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: false,
                data: null,
                message: 'No token provided or invalid format'
            });
        }

        // Extract token from header
        const token = authHeader.replace('Bearer ', '');

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // Log the error for internal tracking (optional)
        console.error('Token verification error:', err);

        // Respond with a user-friendly error message
        res.status(401).json({
            status: false,
            data: null,
            message: 'Invalid or expired token'
        });
    }
};
