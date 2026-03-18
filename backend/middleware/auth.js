const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Header check karo
    const token = req.header('x-auth-token');
    const secret = process.env.JWT_SECRET;

    console.log("--- AUTH CHECK START ---");
    console.log("1. Token received:", token ? "YES (Starts with: " + token.substring(0,10) + "...)" : "NO ❌");
    console.log("2. Secret loaded:", secret ? "YES ✅" : "NO (Check Render Dashboard) ❌");

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded.user;
        console.log("3. Verification: SUCCESS ✅");
        console.log("--- AUTH CHECK END ---");
        next();
    } catch (err) {
        console.log("3. Verification: FAILED ❌ - Error:", err.message);
        console.log("--- AUTH CHECK END ---");
        // Agar yahan 'invalid signature' aata hai, toh secret mismatch hai
        res.status(401).json({ message: 'Token is not valid' });
    }
};