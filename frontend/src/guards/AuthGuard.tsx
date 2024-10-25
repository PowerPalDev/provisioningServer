import React from 'react';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
    isAuthenticated: boolean;
    children: JSX.Element;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ isAuthenticated, children }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default AuthGuard;
