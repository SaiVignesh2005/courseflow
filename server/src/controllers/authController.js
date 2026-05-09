
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login= async (req, res) => {
    const {rollNumber, password} = req.body;
    const user = await User.findOne({rollNumber});
    if(!user){
        return res.status(404).json({message: 'User not found'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(401).json({
            message: 'Invalid credentials'
        });
    }

    const token= jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d'
        }
    )

    res.status(200).json({message: 'Login successful', token, role: user.role});
};

module.exports = {login};
