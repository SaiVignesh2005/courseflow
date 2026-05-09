import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

const CreateCourse = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        courseCode: '',
        courseName: '',
        department: '',
        credits: '',
        capacity: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try{

            await API.post('/courses', formData);

            alert('Course created successfully');

            navigate('/courses');

        } catch(err){

            alert(
                err.response
                ? err.response.data.message
                : err.message
            );

        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-10 rounded-2xl shadow-lg w-[400px]"
            >

                <h1 className="text-3xl font-bold mb-6">
                    Create Course
                </h1>

                <input
                    type="text"
                    name="courseCode"
                    placeholder="Course Code"
                    value={formData.courseCode}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl mb-4"
                />

                <input
                    type="text"
                    name="courseName"
                    placeholder="Course Name"
                    value={formData.courseName}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl mb-4"
                />

                <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl mb-4"
                />

                <input
                    type="number"
                    name="credits"
                    placeholder="Credits"
                    value={formData.credits}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl mb-4"
                />

                <input
                    type="number"
                    name="capacity"
                    placeholder="Capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl mb-6"
                />

                <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl"
                >
                    Create Course
                </button>

            </form>

        </div>
    );
};

export default CreateCourse;