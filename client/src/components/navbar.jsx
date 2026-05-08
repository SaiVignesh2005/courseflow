import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="w-64 flex-shrink-0 min-h-screen bg-slate-900 text-white p-6 flex flex-col justify-between">
            <div>
                <h1 className="text-3xl font-bold mb-10">
                    CourseFlow
                </h1>

                <div className="flex flex-col gap-4">
                    <Link
                        to="/courses"
                        className="bg-slate-800 p-3 rounded-lg transition"
                    >
                        Courses
                    </Link>

                    <Link
                        to="/enrolled"
                        className="bg-slate-800 p-3 rounded-lg transition"
                    >
                        Enrolled Courses
                    </Link>
                </div>
            </div>

            <button
                className="bg-red-500 hover:bg-red-600 p-3 rounded-lg cursor-pointer transition duration-300"
                onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default Navbar;