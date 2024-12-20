import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState(() => {
        return JSON.parse(localStorage.getItem('userDetails')) || null;
    });

    return (
        <AuthContext.Provider value={{ userDetails, setUserDetails }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};