import axios from "axios";
const api=axios.create({
    baseURL:'https://karban-board-1.onrender.com/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) =>{
    const token=localStorage.getItem('token');
    if(token){
        config.headers['x-auth-token'] = token;
    }
    return config;
    
},
(error) => {
      
        return Promise.reject(error);
    }
);


export default api;