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
