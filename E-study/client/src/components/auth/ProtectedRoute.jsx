import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
    const { userInfo } = useAuth();

    if (!userInfo) {
        return <Navigate to="/login" />;
    }

    const hasRequiredRole = !role ||
        userInfo.role === role ||
        (role === 'admin' && userInfo.role === 'super_admin');

    if (!hasRequiredRole) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default ProtectedRoute;
 
