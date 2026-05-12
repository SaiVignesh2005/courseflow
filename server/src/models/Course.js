const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
    {
        courseCode : {
            type : String,
            required : true,
            unique : true
        },
        courseName : {
            type : String, 
            required : true
        },
        department : {
            type : String,
            required : true
        },
        credits : {
            type : Number,
            required : true
        },
        capacity : {
            type : Number,
            required : true
        },
        allowedDepartments : {
            type : [String],
            default : []
        },
        allowedSemesters : {
            type : [Number],
            default : []
        },
        students: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            default: []
        },
        waitlist : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps : true
    }
);

module.exports = mongoose.model('Course', CourseSchema);