
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAdminAuthenticated, isStudentAuthenticated, isTrainerAuthenticated } from './authUtils';

const PrivateRoute = ({ role, children }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Small delay to ensure localStorage is fully set after login
        const checkAuth = () => {
            let authenticated = false;
            
            switch (role) {
                case "student":
                    authenticated = isStudentAuthenticated();
                    break;
                case "trainer":
                    authenticated = isTrainerAuthenticated();
                    break;
                case "admin":
                    authenticated = isAdminAuthenticated();
                    break;
                default:
                    authenticated = false;
            }
            
            setIsAuthenticated(authenticated);
            setIsChecking(false);
        };

        // Add a small delay to handle timing issues
        const timer = setTimeout(checkAuth, 100);
        
        return () => clearTimeout(timer);
    }, [role]);

    // Show loading while checking authentication
    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Determine login route based on role
    const getLoginRoute = () => {
        switch (role) {
            case "admin":
                return "/supremehandling";
            case "student":
            case "trainer":
            default:
                return "/login";
        }
    };

    return isAuthenticated ? children : <Navigate to={getLoginRoute()} replace />;
};

export default PrivateRoute;
