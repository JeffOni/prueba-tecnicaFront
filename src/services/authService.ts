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
                    username: credentials.username,
                    password: credentials.password,
                    expiresInMins: 30 // opcional pero recomendado
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Login error:', errorData);
                throw new Error(errorData.message || "Credenciales inválidas");
            }

            const data: AuthResponse = await response.json();
            localStorage.setItem('token', data.accessToken);
            return data;
        } catch (error) {
            console.error('Login request failed:', error);
            throw error;
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
