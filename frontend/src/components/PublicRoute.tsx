import type { JSX } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
    children: JSX.Element;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) return <p>Carregando...</p>;

    if (user) return <Navigate to="/" replace />;

    return children;
};
