const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const authHeader = req.header('Authorization');

    if(!authHeader){
        return res.status(401).json(
            {
                message: 'No token, authorization denied'
            }
        )
    }

    const token = authHeader.split(' ')[1];

    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
    catch(err){
        return res.status(401).json(
            {
                message: 'Invalid token'
            }
        )
    }

};

module.exports = authMiddleware;