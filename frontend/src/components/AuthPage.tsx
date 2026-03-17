import React, { useState } from 'react';
import LoginForm from './Login';
import RegisterForm from './Register';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-blue-600">
                        {isLogin ? "Login" : "Register"}
                    </h2>
                    <p className="text-gray-500 mt-2">
                        {isLogin ? "Welcome back to your board!" : "Start organizing your tasks today."}
                    </p>
                </div>

              
                {isLogin ? <LoginForm /> : <RegisterForm />}

               
                <div className="mt-6 text-center border-t pt-4">
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-500 font-semibold hover:underline"
                    >
                        {isLogin 
                            ? "Don't have an account? Register here" 
                            : "Already have an account? Login here"
                        }
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AuthPage;