import React, { createContext, useState, useContext, useEffect} from 'react';
import api from '../utils/api';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('token'));
    const [loading,] = useState<boolean>(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        setIsAuthenticated(true);
            api.defaults.headers.common['x-auth-token'] = storedToken;
        }
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setIsAuthenticated(true);
        api.defaults.headers.common['x-auth-token'] = newToken
    };


    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
        delete api.defaults.headers.common['x-auth-token'];
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
