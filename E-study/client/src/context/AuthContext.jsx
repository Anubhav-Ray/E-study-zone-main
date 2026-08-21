import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        try {
            const saved = localStorage.getItem('userInfo');
            return saved ? JSON.parse(saved) : null;
        } catch (err) {
            return null;
        }
    });

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setUserInfo(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const register = async (userData) => {
        const { data } = await api.post('/auth/register', userData);
        setUserInfo(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const registerAdmin = async (userData) => {
        const { data } = await api.post('/auth/register-admin', userData);
        setUserInfo(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        return data;
    };

    const logout = () => {
        setUserInfo(null);
        localStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ userInfo, login, register, registerAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
