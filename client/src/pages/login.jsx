import { useState } from "react";
import axios from "axios";
import './login.css';

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
            console.log(response.data);
        }
        catch(error){
            console.error(error.response.data);
        }
    }

    return(
        <div className="login-container">
            <div className="login-card">

                <h1>Login</h1>

                <input 
                    type="text" 
                    placeholder="Roll Number" 
                    value={rollNumber} 
                    onChange={(e) => setRollNumber(e.target.value)} 
                />

                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />

                <button onClick={handleLogin}>
                    Login
                </button>
                
            </div>
        </div>
    )
}

export default Login;