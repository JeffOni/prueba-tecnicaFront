import type { AuthResponse, LoginCredentials } from "../types";

const API_URL = "https://dummyjson.com";
export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: credentials.username.trim(),
                    password: credentials.password.trim(),
                    expiresInMins: 30
                })
            });

            if (!response.ok) {
                throw new Error("Usuario o contraseña incorrectos");
            }

            const data: AuthResponse = await response.json();
            localStorage.setItem('token', data.accessToken);
            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Error al iniciar sesión. Por favor, intenta nuevamente.");
        }
    },
    logout(): void {
        localStorage.removeItem('token');
    },
    getToken(): string | null {
        return localStorage.getItem('token');
    },
    isAuthenticated(): boolean {
        return this.getToken() !== null;
    }
};
