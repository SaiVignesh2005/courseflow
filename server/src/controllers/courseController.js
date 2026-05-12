const Course = require('../models/Course');

const getCourses = async (req, res, next) => {

    try{
        const courses = await Course.find();

        const filteredCourses = courses.filter(course => {
            const allowedDepartments = course.allowedDepartments.length==0 || course.allowedDepartments.includes(req.user.department);
            const allowedSemesters = course.allowedSemesters.length==0 || course.allowedSemesters.includes(req.user.semester);
            return allowedDepartments && allowedSemesters;
        });

        const updatedCourses = filteredCourses.map(course => {
            const isEnrolled = course.students && course.students.some(
                studentId => studentId.toString() === req.user.id.toString()
            );
            const seatsAvailable = course.capacity-(course.students ? course.students.length : 0);
            const isFull = course.students.length >= course.capacity;
            const isWaitlisted = course.waitlist && course.waitlist.some(
                studentId => studentId.toString() === req.user.id.toString()
            );

            return {
                ...course.toObject(),
                isEnrolled,
                seatsAvailable,
                isFull,
                isWaitlisted
            };

        });

        res.status(200).json(updatedCourses);
    }
    catch(err){
        next(err);
    }

};

const getCourseById = async (req, res,next) => {

    try{
        const course = await Course.findById(req.params.id);
        if(!course){
            const error = new Error('Course not found');
            error.status = 404;
            throw error;
        }
        res.status(200).json(course);
    }
    catch(err){
        next(err);
    }

};

const createCourse = async (req, res, next) => {

    try{

        const {
            courseCode,
            courseName,
            capacity,
            department,
            credits,
            allowedDepartments,
            allowedSemesters
        } = req.body;

        if(!courseCode || !courseName || capacity==null || !department || credits==null){

            const error = new Error('All fields are required');

            error.status = 400;

            throw error;
        }

        const existingCourse = await Course.findOne({ courseCode });

        if(existingCourse){

            const error = new Error('Course already exists');

            error.status = 400;

            throw error;
        }

        const course = await Course.create({
            courseCode,
            courseName,
            capacity,
            department,
            credits
        });

        const io = req.app.get('io');

        io.emit('courseUpdated', course);

        res.status(201).json(course);

    }

    catch(err){

        next(err);

    }

};

const updateCourse = async (req, res, next) => {

    try{
        const course = await Course.findById(req.params.id);
        if(!course){
            const error = new Error('Course not found');
            error.status = 404;
            throw error;
        }

        if(req.body.capacity!=null && req.body.capacity<1){
            const error = new Error('Capacity must be positive');
            error.status = 400;
            throw error;
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );
        const io = req.app.get('io');
        io.emit('courseUpdated',updatedCourse);
        res.status(200).json(updatedCourse);
    }

    catch(err){
        next(err);
    }

};

const deleteCourse = async (req, res, next) => {

    try{
        const course = await Course.findById(req.params.id);
        if(!course){
            const error = new Error('Course not found');
            error.status = 404;
            throw error;
        }

        await Course.findByIdAndDelete(req.params.id);
        const io = req.app.get('io');
        io.emit('courseUpdated', course);
        res.status(200).json({message: 'Course deleted successfully'});

    }


    catch(err){
        next(err);
    }

};

const enrollCourse = async (req,res,next)=>{

    let session;
    
    try{

        const mongoose = require('mongoose');
        session = await mongoose.startSession();
        session.startTransaction();

        const course = await Course.findById(req.params.id).session(session);
        if(!course){
            await session.abortTransaction();
            await session.endSession();
            const error = new Error('Course not found');
            error.status = 404;
            throw error;
        }

        const alreadyEnrolled = course.students && course.students.some(
            studentId => studentId.toString() === req.user.id.toString()
        );

        if(alreadyEnrolled){
            await session.abortTransaction();
            await session.endSession();
            const error = new Error('Already enrolled in this course');
            error.status = 400;
            throw error;
        }

        
        if(course.capacity && course.students && course.students.length >= course.capacity){

            if(!course.waitlist){
                course.waitlist = [];
            }

            const alreadyWaitlisted =
                course.waitlist &&
                course.waitlist.some(
                    studentId => studentId.toString() === req.user.id.toString()
                );

            if(alreadyWaitlisted){

                const error = new Error('Already in waitlist');

                error.status = 400;

                throw error;
            }

            course.waitlist.push(req.user.id);
           


            await course.save({ session });
            const updated = await Course.findById(course._id);           

            await session.commitTransaction();

            const io = req.app.get('io');

            io.emit('courseUpdated', course);

            return res.status(200).json({
                message: 'Added to waitlist'
            });
        }

        if(!course.students){
            course.students = [];
        }

        course.students.push(req.user.id);
        await course.save({session});

        await session.commitTransaction(); 
        const io = req.app.get('io');
        io.emit('courseUpdated', course);
        await session.endSession();

        res.status(200).json({message: 'Enrolled in course successfully'});
    }catch(err){
        if(session?.inTransaction()){
            await session.abortTransaction();
        }
        if(session){
            await session.endSession();
        }
        next(err);
    }

};

const getEnrolledCourses = async (req, res, next) => {
    try{
        const courses = await Course.find({students: req.user.id});
        res.status(200).json(courses);
    }
    catch(err){
        next(err);
    }
};

const dropCourse = async (req, res, next) => {
    try{
        const course = await Course.findById(req.params.id);
        if(!course){
            const error = new Error('Course not found');
            error.status = 404;
            throw error;
        }
        
        const enrolled = course.students.some(
            studentId => studentId.toString() === req.user.id.toString()
        );

        if(!enrolled){
            const error = new Error('Not enrolled in this course');
            error.status = 400;
            throw error;
        }

        course.students = course.students.filter(studentId => studentId.toString() !== req.user.id.toString());

        if(course.waitlist && course.waitlist.length > 0){
            const nextStudentId = course.waitlist.shift();
            course.students.push(nextStudentId);
        }

        await course.save();
        const io = req.app.get('io');
        io.emit('courseUpdated', course);
        res.status(200).json({message: 'Dropped course successfully'});
    }
    catch(err){
        next(err);
    }
};

const leaveWaitlist = async (req, res, next) => {
    try{
        const course = await Course.findById(req.params.id);
        if(!course){
            const error = new Error('Course not found');
            error.status = 404;
            throw error;
        }
        const isWaitlisted = course.waitlist && course.waitlist.some(
            studentId => studentId.toString() === req.user.id.toString()
        );
        if(!isWaitlisted){
            const error = new Error('Not in waitlist for this course');
            error.status = 400;
            throw error;
        }
        course.waitlist = course.waitlist.filter(studentId => studentId.toString() !== req.user.id.toString());
        await course.save();
        const io = req.app.get('io');
        io.emit('courseUpdated', course);
        res.status(200).json({message: 'Left waitlist successfully'});
    }
    catch(err){
        next(err);
    }
};


module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getEnrolledCourses,
    dropCourse,
    enrollCourse,
    leaveWaitlist
}