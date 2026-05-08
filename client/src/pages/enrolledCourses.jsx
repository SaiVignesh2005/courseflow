import {useEffect, useState} from 'react';
import API from '../api/api';
import Navbar from '../components/navbar';
import {useNavigate} from 'react-router-dom';

const enrolledCourses = () =>{

    const navigate = useNavigate();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token){
            navigate('/');
        }
        else{
            setAuthorized(true);
        }
    }, []);

    const [enrolledCourses, setEnrolledCourses] = useState([]);
    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    const fetchEnrolledCourses = async () => {
        try{
            const response = await API.get('/courses/enrolled');
            setEnrolledCourses(response.data);
        }
        catch(error){
            console.error('Error fetching enrolled courses:', error.response ? error.response.data : error.message);
        }
    };

    const dropCourse = async (courseId) => {
        try{
            const response = await API.delete(`/courses/${courseId}/drop`);
            alert('Dropped course successfully');
            fetchEnrolledCourses();
        }catch(error){
            alert('Error dropping course: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    if(!authorized){
        return null;
    }

    return(

        <div style={{display:'flex', minHeight:'100vh', background:'#f3f4f6'}}>

            <Navbar />

            <div className="flex-1 p-10">

                <div className="mb-10">

                    <h1 className="text-4xl font-bold">
                        Enrolled Courses
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your enrolled courses
                    </p>

                </div>

                {
                    enrolledCourses.length === 0 ? (

                        <p>No enrolled courses</p>

                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                            {enrolledCourses.map((course) => (

                                <div
                                    key={course._id}
                                    className="bg-white rounded-2xl shadow-md p-6 transition duration-300 hover:scale-105 hover:shadow-xl"
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
                                        className="w-full bg-red-500 hover:bg-red-600 transition duration-300 text-white py-3 rounded-xl cursor-pointer"
                                        onClick={() => dropCourse(course._id)}
                                    >
                                        Drop Course
                                    </button>

                                </div>

                            ))}

                        </div>

                    )
                }

            </div>

        </div>

    );

};

export default enrolledCourses;