import { createContext, useContext, useState } from 'react';
import { login } from '../services/auth';

//create a global context for auth
const AuthContext = createContext();

//authprovider handles logic for the global auth state
export function AuthProvider({ children }){
    //set user data in state and loading state
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    //login user attempts to login the user from the services
    const loginUser = async (email, password, site_id) => {
        try {
            setLoading(true);
            const data = await login(email, password, site_id);

            setUser(data);
            return data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    //if logs out sets user to null
    const logout = () => {
        setUser(null);
    };

    return(
        <AuthContext.Provider
            value={{
                user,
                loginUser,
                logout,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
}