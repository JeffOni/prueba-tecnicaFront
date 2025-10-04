import { createContext, useContext, useState, useEffect } from "react";
import type { User, LoginCredentials } from "../types";
import { authService } from "../services/authService";

interface AuthContextType {
    user: User | null;              // Usuario actual (null = no logueado)
    isAuthenticated: boolean;        // true si hay usuario
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    loading: boolean;                // true mientras verifica token inicial
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar si hay token y datos de usuario guardados
        const token = authService.getToken();
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setUser(userData);
            } catch (error) {
                console.error('Error parsing saved user:', error);
                // Si hay error, limpiar el localStorage
                authService.logout();
                localStorage.removeItem('user');
            }
        }

        setLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        setLoading(true);
        try {
            const userData = await authService.login(credentials);
            setUser(userData);
            // Guardar datos del usuario en localStorage
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error("Login failed", error);
            throw error; // Propagamos el error para que Login.tsx pueda manejarlo
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
