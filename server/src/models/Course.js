const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
    {
        courseCode : {
            type : String,
            unique : true
        },
        courseName : String,
        department : String,
        credits : Number,
        capacity : Number
    },
    {
        timestamps : true
    }
);

module.exports = mongoose.model('Course', CourseSchema);