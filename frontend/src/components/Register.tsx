import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const RegisterForm: React.FC = () => {

    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/auth/register', formData);
            localStorage.setItem('token', res.data.token);

            alert('Ragistration Succes');
            navigate('/board');

        }
        catch (err: any) {
            alert(err.response?.data?.message || 'Ragistered Faild');
        }
    }
    return (
        <form onSubmit={handleSubmit} className="space -y-4  bg-white p-6 shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-center  text-gray-800"> Create Account</h1>
            <input type="text" placeholder="Enter Full anme"
                className="w-full p-2 border-rounded outline-none focus:ring-2 focus:rign-green-400"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required />
            <input type="email"
                placeholder="Email Address"
                className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-green-400"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
            />
            <input
                type="password"
                placeholder="Set Password"
                className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-green-400"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
            />
            <button
                type="submit"
                className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 font-semibold transition"
            >
                Register
            </button>
        </form>
    )

};
export default RegisterForm;