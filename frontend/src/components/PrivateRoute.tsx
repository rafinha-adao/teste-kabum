import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth();

    if (loading) return <p>Carregando...</p>; // renderiza só enquanto carrega

    if (!user) return <Navigate to="/login" replace />;

    return children;
};