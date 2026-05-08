import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import Navbar from '../components/navbar.jsx';

const Courses = () => {
    const navigate = useNavigate();
    const [authorized, setAuthorized] = useState(false);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/');
            return;
        }

        setAuthorized(true);
    }, [navigate]);

    useEffect(() => {
        if (authorized) {
            fetchCourses();
        }
    }, [authorized]);

    const fetchCourses = async () => {
        try {
            const response = await API.get('/courses');
            setCourses(response.data);
        } catch (error) {
            console.error(
                'Error fetching courses:',
                error.response ? error.response.data : error.message
            );
        }
    };

    const enrollCourse = async (courseId) => {
        try {
            await API.post(`/courses/${courseId}/enroll`);
            alert('Enrolled successfully');
        } catch (error) {
            alert(
                'Error enrolling in course: ' +
                    (error.response ? error.response.data.message : error.message)
            );
        }
    };

    if (!authorized) {
        return null;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6' }}>
            <Navbar />

            <div className="flex-1 p-10">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold">Dashboard</h1>
                    <p className="text-gray-500 mt-2">
                        Browse and enroll in available courses
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

    <div className="bg-white rounded-2xl shadow-md p-6 transition duration-300 hover:scale-105 hover:shadow-xl">

        <h2 className="text-gray-500 text-lg">
            Total Courses
        </h2>

        <p className="text-4xl font-bold mt-4">
            {courses.length}
        </p>

    </div>

    <div className="bg-white rounded-2xl shadow-md p-6 transition duration-300 hover:scale-105 hover:shadow-xl">

        <h2 className="text-gray-500 text-lg">
            Departments
        </h2>

        <p className="text-4xl font-bold mt-4">
            {
                [...new Set(courses.map(course => course.department))].length
            }
        </p>

    </div>

    <div className="bg-white rounded-2xl shadow-md p-6 transition duration-300 hover:scale-105 hover:shadow-xl">

        <h2 className="text-gray-500 text-lg">
            Total Credits
        </h2>

        <p className="text-4xl font-bold mt-4">
            {
                courses.reduce((sum, course) => sum + course.credits, 0)
            }
        </p>

    </div>

</div>

                {courses.length === 0 ? (
                    <p>No courses available</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div
                                key={course._id}
                                className="bg-white rounded-2xl shadow-md p-6"
                            >
                                <h2 className="text-2xl font-bold mb-2">
                                    {course.courseName}
                                </h2>

                                <p className="text-gray-600">
                                    {course.courseCode}
                                </p>

                                <p className="text-gray-600 mb-2">
                                    {course.department}
                                </p>

                                <p className="text-gray-600 mb-6">
                                    Credits: {course.credits}
                                </p>

                                <button
                                    className="w-full bg-blue-500 hover:bg-blue-600 transition duration-300 text-white py-3 rounded-xl cursor-pointer"
                                    onClick={() => enrollCourse(course._id)}
                                >
                                    Enroll
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Courses;                 