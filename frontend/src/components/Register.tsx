import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from 'react-router-dom';


const RegisterForm: React.FC = () => {

    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        try {
            const res = await api.post('/auth/register', formData);
            localStorage.setItem('token', res.data.token);

            alert('Ragistration Succes');
            navigate('/board');

        }
        catch (err: any) {
            alert(err.response?.data?.message || 'Ragistered Faild');
        }
    }
    return (
         <div style={{width:'30%', boxShadow:'-1px -1px 30px 1px rgba(157, 173, 201, 0.98)', border:'2px solid', borderRadius:'40px', height:'500px',margin:'150px 0px 0px 500px' }}>
      
        <form onSubmit={handleSubmit} >
            <h1 style={{textAlign:'center', fontSize:'40px'}}> Create Account</h1>
            <input type="text" placeholder="Enter Full anme"
                style={{width:'80%', fontSize:'15px', paddingLeft:'10px' ,marginBottom:'30px', marginLeft:'30px'}}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required />
            <input type="email"
                placeholder="Email Address"
                style={{width:'80%', fontSize:'15px', paddingLeft:'10px' ,marginBottom:'30px', marginLeft:'30px'}}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
            />
            <input
                type="password"
                placeholder="Set Password"
                style={{width:'80%', fontSize:'15px', paddingLeft:'10px' ,marginBottom:'30px', marginLeft:'30px'}}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
            />
            <button
                type="submit"
                style={{fontSize:'15px',borderRadius:'30px', textAlign:'center', marginLeft:'30px', paddingLeft:'20px', paddingRight:'20px', paddingTop:'5px', paddingBottom:'5px'}}
            >
                Register
            </button>
        </form>
        </div>
    )

};
export default RegisterForm;