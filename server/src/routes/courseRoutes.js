const express = require('express');
const router = express.Router();

const {getCourses, getCourseById, createCourse, updateCourse, deleteCourse,getEnrolledCourses,dropCourse,enrollCourse} = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getCourses);
router.get('/enrolled', authMiddleware, getEnrolledCourses);
router.get('/:id', authMiddleware, getCourseById);

router.post('/', authMiddleware, createCourse);
router.post('/:id/enroll', authMiddleware, enrollCourse);

router.put('/:id', authMiddleware, updateCourse);

router.delete('/:id/drop', authMiddleware, dropCourse);
router.delete('/:id', authMiddleware, deleteCourse);


module.exports = router;