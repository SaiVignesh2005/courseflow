import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import Navbar from '../components/navbar.jsx';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const Courses = () => {
    const navigate = useNavigate();
    const [authorized, setAuthorized] = useState(false);
    const [courses, setCourses] = useState([]);
    const [role, setRole] = useState('');


    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');

        if (!token) {
            navigate('/');
            return;
        }

        setAuthorized(true);
        setRole(userRole);
    }, [navigate]);

    useEffect(() => {

        socket.on('connect', () => {
            console.log('Connected to Socket.IO server ' + socket.id);
        });

        socket.on('courseUpdated', async () => {
            try{
                const response = await API.get('/courses');
                setCourses(response.data);
            }
            catch(err){
                console.log(err);
            }
            });

    }, []);

    useEffect(() => {
        const loginSuccess= localStorage.getItem('loginSuccess');
        if(loginSuccess){
            toast.success('Login successful');
            localStorage.removeItem('loginSuccess');
        }
    },[]);

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
            await fetchCourses();
            toast.success('Enrollment successful');
        } catch (error) {
            toast.error(
                error.response ? error.response.data.message : error.message
            );
        }
    };

    const leaveWaitlist = async (courseId) => {
        try{
            const response = await API.delete(`/courses/${courseId}/leave-waitlist`);
            await fetchCourses();
            toast.success(response.data.message);
        }
        catch(err){
            toast.error(
                err.response? err.response.data.message : err.message
            );
        }
    };

    const deleteCourse = async (courseId) => {
        try{
            await API.delete(`/courses/${courseId}`);
            toast.success('Course deleted successfully');
            fetchCourses();
        }catch(err){
            toast.error(
                err.response? err.response.data.message : err.message
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
                    {
                        role === 'admin' && (
                            <button
                                onClick={() => navigate('/create-course')}
                                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl cursor-pointer transition duration-300  font-semibold"
                            >
                                Create Course
                            </button>
                        )
                    }
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
                                className="bg-white rounded-2xl shadow-md p-6 hover:transition duration-300 hover:scale-105 hover:shadow-xl"
                            >
                              
                                <h2 className="text-2xl font-bold mb-2 min-h-[80px]">
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

                                <p className="text-gray-600 mb-6">
                                    Seats Left: {course.seatsAvailable}
                                </p>

                                {
                                    role === 'student' && (
                                        course.isEnrolled ? (
                                            <div className="w-full bg-green-100 text-green-600 text-center py-3 rounded-xl font-semibold">
                                                Already Enrolled
                                            </div>
                                        ) : course.isWaitlisted ? (
                                                <button
                                                    className="w-full bg-yellow-400 hover:bg-yellow-500 transition duration-300 text-white py-3 rounded-xl cursor-pointer"
                                                    onClick={() => leaveWaitlist(course._id)}
                                                >
                                                    Leave Waitlist
                                                </button>
                                        ) : (
                                            <button
                                                className="w-full bg-blue-500 hover:bg-blue-600 transition duration-300 text-white py-3 rounded-xl cursor-pointer"
                                                onClick={() => enrollCourse(course._id)}
                                            >
                                                {course.isFull ? 'Join Waitlist' : 'Enroll'}
                                            </button>
                                        )
                                    )
                                }

                                {
                                    role === 'admin' && (
                                        <button
                                            className="w-full bg-red-500 hover:bg-red-600 transition duration-300 text-white py-3 rounded-xl cursor-pointer mt-3"
                                            onClick={() => deleteCourse(course._id)}
                                        >
                                            Delete Course
                                        </button>
                                    )
                                }
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Courses;                 