const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

    const token = req.header('x-auth-token');
        const secret=process.env.JWT_SECRET || 'ansh49shiv';

    if (!token) {
        return res.status(401).json({ message: 'No token, auth denied' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.log("JWT Verification Error:", err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};