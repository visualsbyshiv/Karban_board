import React, { useState,type FormEvent} from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from "../Context/authContext";
import api from "../utils/api";

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { login } = useAuth();


    const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
        console.log("🚀 Login request bhej raha hoon... Data:", formData);
        const res = await api.post('/auth/login', formData);

        console.log("📥 Backend se Data aaya (Full Response):", res.data);

        let token = "";
        // 🕵️‍♂️ Check karo ki backend string bhej raha hai ya object
        if (typeof res.data === 'string') {
            token = res.data;
        } else if (res.data && res.data.token) {
            token = res.data.token;
        }

        console.log("🔑 Extracted Token:", token ? "MIL GAYA! ✅" : "NAHI MILA! ❌");

        if (token) {
            localStorage.setItem('token', token);
            login(token); 
            console.log("💾 Storage mein set ho gaya:", localStorage.getItem('token') ? "YES" : "NO");
            navigate('/board');
        } else {
            console.error("⚠️ Token verify nahi ho paya, response check karo!");
        }
    } catch (err: any) {
        // 🔥 Sabse zaroori log!
        console.error("🚨 LOGIN CRASH ERROR:", err.response?.data || err.message);
        alert(err.response?.data?.message || 'Login Failed');
    }
}

    return (
        <div style={{width:'30%', boxShadow:'-1px -1px 30px 1px rgba(157, 173, 201, 0.98)', border:'2px solid', borderRadius:'40px', height:'500px',margin:'150px 0px 0px 500px' }}>
        <form onSubmit={handleSubmit}>
            <h2 className="font-bold text-center" style={{textAlign:'center', fontSize:'40px'}}>Login</h2>
            <input type="email" placeholder="Enter your Email"  style={{width:'80%', fontSize:'15px', paddingLeft:'10px' ,marginBottom:'30px', marginLeft:'30px'}}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input type="password" placeholder="Enter your Password"  style={{width:'80%', fontSize:'15px', paddingLeft:'10px' ,marginBottom:'30px', marginLeft:'30px'}}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            < button type="submit" style={{fontSize:'15px',borderRadius:'30px', textAlign:'center', marginLeft:'30px', paddingLeft:'20px', paddingRight:'20px', paddingTop:'5px', paddingBottom:'5px'}} >Login</button>
            <p  style={{textAlign:'center'}}>
                Don't have an account?
                <Link to="/register" >
                    Register here
                </Link>
            </p>
        </form>
        </div>

    );

};
export default LoginForm;
