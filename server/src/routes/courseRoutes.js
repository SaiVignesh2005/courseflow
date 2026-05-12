const express = require('express');
const router = express.Router();

const {getCourses, getCourseById, createCourse, updateCourse, deleteCourse,getEnrolledCourses,dropCourse,enrollCourse,leaveWaitlist} = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', authMiddleware, getCourses);
router.get('/enrolled', authMiddleware, getEnrolledCourses);
router.get('/:id', authMiddleware, getCourseById);

router.post('/', authMiddleware, adminMiddleware, createCourse);
router.post('/:id/enroll', authMiddleware, enrollCourse);

router.put('/:id', authMiddleware,adminMiddleware, updateCourse);

router.delete('/:id/drop', authMiddleware, dropCourse);
router.delete('/:id/leave-waitlist', authMiddleware, leaveWaitlist);
router.delete('/:id', authMiddleware,adminMiddleware, deleteCourse);



module.exports = router;