
import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Set Backend URL
    // const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001/api/users";
    const API_URL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5001") + "/api/users";

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    };
                    const { data } = await axios.get(`${API_URL}/me`, config);

                    setUser(data);
                } catch (error) {
                    console.error("Auth check failed:", error);
                    localStorage.removeItem("token");
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/login`, {
                email,
                password,
            });

            localStorage.setItem("token", data.token);
            setUser(data);
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message);
            return {
                success: false,
                message: error.response?.data?.message || "Login failed",
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await axios.post(API_URL, {
                name,
                email,
                password,
            });

            localStorage.setItem("token", data.token);
            setUser(data);
            return { success: true };
        } catch (error) {
            console.error("Registration failed:", error.response?.data?.message);
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed",
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const googleLogin = async (accessToken) => {
        try {
            const { data } = await axios.post(`${API_URL}/google`, {
                token: accessToken,
            });

            localStorage.setItem("token", data.token);
            setUser(data);
            return { success: true };
        } catch (error) {
            console.error("Google Login failed:", error.response?.data?.message);
            return {
                success: false,
                message: error.response?.data?.message || "Google Login failed",
            };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
