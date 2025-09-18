import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../services/api";

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => false,
    logout: async () => { }
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/me")
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            await api.post("/login", { email, password });
            const res = await api.get("/me");

            setUser(res.data);

            return true;
        } catch {
            setUser(null);

            return false;
        }
    }

    const logout = async (): Promise<void> => {
        await api.delete("/logout").finally(() => setUser(null));
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
