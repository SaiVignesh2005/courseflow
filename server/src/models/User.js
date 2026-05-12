const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name : String,
        rollNumber :{
            type : String,
            unique : true
        },
        email: {
            type : String,
            unique : true
        },
        password : String,
        role : {
            type : String,
            enum : ['student', 'admin'],
            default : 'student'
        },
        department : String,
        semester : Number,
    },
    {
        timestamps : true
    }
);

module.exports = mongoose.model('User', UserSchema);