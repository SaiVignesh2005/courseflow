import { useState } from "react";
import axios from "axios";

const Login = () =>{

    const [rollNumber, setRollNumber] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async () => {
        try{
            const response = await axios.post('http://localhost:5000/api/auth/login', 
                {
                    rollNumber,
                    password
                }
            );
            localStorage.setItem('token', response.data.token);
            window.location.href = '/courses';
            console.log(response.data);
        }
        catch(error){
            console.error(error.response.data);
        }
    }

    return(

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">

            <div className="bg-white p-10 rounded-2xl shadow-xl w-[400px]">

                <h1 className="text-4xl font-bold mb-2 text-center">
                    CourseFlow
                </h1>

                <div className="flex flex-col gap-5">

                    <input
                        type="text"
                        placeholder="Roll Number"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        className="border border-gray-300 p-4 rounded-xl outline-none focus:border-blue-500"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 p-4 rounded-xl outline-none focus:border-blue-500"
                    />

                    <button
                        onClick={handleLogin}
                        className="bg-blue-500 hover:bg-blue-600 transition duration-300 text-white py-4 rounded-xl font-semibold cursor-pointer"
                    >
                        Login
                    </button>

                </div>

            </div>

        </div>

    );
}

export default Login;