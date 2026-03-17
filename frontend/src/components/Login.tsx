import React, { useState,type FormEvent} from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from "../Context/authContext";

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const res = await axios.post('http://localhost:8080/api/auth/login', formData);
        if (res.data.token) {
            login(res.data.token);
            navigate('/board');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow-md rounded">
            <h2 className="text-xl font-bold">Login</h2>
            <input type="email" placeholder="Enter your Email" className="w-full p-2 border"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input type="password" placeholder="Enter your Password" className="w-full p-2 border"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            < button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" >Login</button>
            <p className="text-center text-gray-600 mt-4">
                Don't have an account?
                <Link to="/register" className="text-blue-600 font-bold hover:underline ml-1">
                    Register here
                </Link>
            </p>
        </form>

    );

};
export default LoginForm;
