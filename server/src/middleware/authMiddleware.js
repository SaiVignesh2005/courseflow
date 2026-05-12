const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {

    const authHeader = req.header('Authorization');

    if(!authHeader){

        return res.status(401).json({
            message: 'No token, authorization denied'
        });

    }

    const token = authHeader.split(' ')[1];

    try{

        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(verified.id)
            .select('-password');

        if(!user){

            return res.status(401).json({
                message: 'User not found'
            });

        }

        req.user = user;

        next();

    }

    catch(err){

        return res.status(401).json({
            message: 'Invalid token'
        });

    }

};

module.exports = authMiddleware;