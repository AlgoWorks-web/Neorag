import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdminAuthenticated, isStudentAuthenticated, isTrainerAuthenticated } from './authUtils';

const PrivateRoute = ({ role, children }) => {
    const isAuthenticated =
        role === "student" ? isStudentAuthenticated() :
        role === "trainer" ? isTrainerAuthenticated() :
        role === "admin" ? isAdminAuthenticated() :
        false;

    const loginRoute =
        role === "student" ? "/login" :
        role === "trainer" ? "/login" :
        role === "admin" ? "/supremehandling" :
        "/login";

    return isAuthenticated ? children : <Navigate to={loginRoute} />;
};

export default PrivateRoute;
