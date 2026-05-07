const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        courseId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Course'
        },
        status : {
            type : String,
            enum : ['enrolled', 'waitlisted'],
            default : 'enrolled'
        }
    },
    {
        timestamps : true
    }
);

module.exports = mongoose.model('Enrollment', EnrollmentSchema);