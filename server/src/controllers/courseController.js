const Course = require('../models/Course');

const getCourses = async (req, res) => {

    try{
        const courses = await Course.find();

        const updatedCourses = courses.map(course => {
            const isEnrolled = course.students && course.students.some(
                studentId => studentId.toString() === req.user.id.toString()
            );
            const seatsAvailable = course.capacity-(course.students ? course.students.length : 0);
            const isFull = course.students.length >= course.capacity;

            return {
                ...course.toObject(),
                isEnrolled,
                seatsAvailable,
                isFull
            };

        });

        res.status(200).json(updatedCourses);
    }
    catch(err){
        res.status(500).json({message: 'Server error while fetching courses'});
    }

};

const getCourseById = async (req, res) => {

    try{
        const course = await Course.findById(req.params.id);
        if(!course){
            return res.status(404).json({message: 'Course not found'});
        }
        res.status(200).json(course);
    }
    catch(err){
        res.status(500).json({message: 'Server error while fetching course by ID'});
    }

};

const createCourse = async (req, res) => {
    try{
        const {courseCode, courseName, capacity, department, credits} = req.body;
        const existingCourse = await Course.findOne({courseCode});
        if(existingCourse){
            return res.status(400).json({message: 'Course already exists'});
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

    console.log(err);

    res.status(500).json({
        message: 'Server error while creating course'
    });

}

};

const updateCourse = async (req, res) => {

    try{
        const course = await Course.findById(req.params.id);
        if(!course){
            return res.status(404).json({message: 'Course not found'});
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
        res.status(500).json({message: 'Server error while updating course'});
    }

};

const deleteCourse = async (req, res) => {

    try{
        const course = await Course.findById(req.params.id);
        if(!course){
            return res.status(404).json({message: 'Course not found'});
        }

        await Course.findByIdAndDelete(req.params.id);
        const io = req.app.get('io');
        io.emit('courseUpdated', course);
        res.status(200).json({message: 'Course deleted successfully'});

    }


    catch(err){
        res.status(500).json({message: 'Server error while deleting course'});
    }

};

const enrollCourse = async (req,res)=>{

    let session;
    
    try{

        const mongoose = require('mongoose');
        session = await mongoose.startSession();
        session.startTransaction();

        const course = await Course.findById(req.params.id).session(session);
        if(!course){
            await session.abortTransaction();
            await session.endSession();
            return res.status(404).json({message: 'Course not found'});
        }

        const alreadyEnrolled = course.students && course.students.some(
            studentId => studentId.toString() === req.user.id.toString()
        );

        if(alreadyEnrolled){
            await session.abortTransaction();
            await session.endSession();
            return res.status(400).json({message: 'Already enrolled in this course'});
        }

        if(course.capacity && course.students && course.students.length >= course.capacity){
            await session.abortTransaction();
            await session.endSession();
            return res.status(400).json({message: 'Course is full'});
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
        if(session){
            await session.abortTransaction();
                        await session.endSession();
        }
        res.status(500).json({message: 'Server error while enrolling in course'});
    }

};

const getEnrolledCourses = async (req, res) => {
    try{
        const courses = await Course.find({students: req.user.id});
        res.status(200).json(courses);
    }
    catch(err){
        res.status(500).json({message: 'Server error while fetching enrolled courses'});
    }
};

const dropCourse = async (req, res) => {
    try{
        const course = await Course.findById(req.params.id);
        if(!course){
            return res.status(404).json({message: 'Course not found'});
        }
        
        const enrolled = course.students.some(
            studentId => studentId.toString() === req.user.id.toString()
        );

        if(!enrolled){
            return res.status(400).json({
                message: 'Not enrolled in this course'
            });
        }

        course.students = course.students.filter(studentId => studentId.toString() !== req.user.id.toString());
        await course.save();
        const io = req.app.get('io');
        io.emit('courseUpdated', course);
        res.status(200).json({message: 'Dropped course successfully'});
    }
    catch(err){
        res.status(500).json({message: 'Server error while dropping course'});
        console.log(err);
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
    enrollCourse
}