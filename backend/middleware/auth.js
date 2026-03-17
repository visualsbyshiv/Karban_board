const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

    const token = req.header('x-auth-token');
   

    if (!token) {
        return res.status(401).json({ message: 'No token, auth denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.jWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.log("JWT Verification Error:", err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};