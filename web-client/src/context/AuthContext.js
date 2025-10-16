import React, {createContext, useContext, useEffect, useState} from 'react';
import authService from '../services/authService';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            setInitializing(false);
            return;
        }

        try {
            const userData = JSON.parse(storedUser);
            const decodedToken = jwtDecode(userData.token);
            if (decodedToken.exp * 1000 > Date.now()) {
                setUser(userData);
            } else {
                localStorage.removeItem('user');
            }
        } catch (err) {
            console.error('Failed to restore session', err);
            localStorage.removeItem('user');
        } finally {
            setInitializing(false);
        }
    }, []);

    const login = async (email, password) => {
        const response = await authService.login(email, password);
        const {token} = response.data;
        const userData = jwtDecode(token);
        const session = {...userData, token};
        setUser(session);
        localStorage.setItem('user', JSON.stringify(session));
        return session;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = {user, login, logout, initializing};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
