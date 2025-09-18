import { Navigate, type RouteObject } from "react-router-dom";
import CustomerCreate from "./pages/customers/CustomerCreate";
import CustomerEdit from "./pages/customers/CustomerEdit";
import CustomersList from "./pages/customers/CustomersList";
import Login from "./pages/login/Login";
import NotFound from "./pages/NotFound";
import { PrivateRoute } from "./components/PrivateRoute";
import { PublicRoute } from "./components/PublicRoute";

export const routes: RouteObject[] = [
    {
        path: "/login",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        )
    },
    {
        path: "/",
        element: (
            <PrivateRoute>
                <Navigate to="/customers" replace />
            </PrivateRoute>
        )
    },
    {
        path: "/users",
        element: (
            <PrivateRoute>
                <CustomersList />
            </PrivateRoute>
        )
    },
    {
        path: "/users/create",
        element: (
            <PrivateRoute>
                <CustomerCreate />
            </PrivateRoute>

        )
    },
    {
        path: "/users/:id/edit",
        element: (
            <PrivateRoute>
                <CustomerEdit />
            </PrivateRoute>
        )
    },
    {
        path: "/customers",
        element: (
            <PrivateRoute>
                <CustomersList />
            </PrivateRoute>
        )
    },
    {
        path: "/customers/create",
        element: (
            <PrivateRoute>
                <CustomerCreate />
            </PrivateRoute>
        )
    },
    {
        path: "/customers/:id/edit",
        element: (
            <PrivateRoute>
                <CustomerEdit />
            </PrivateRoute>
        )
    },
    {
        path: "*",
        element: <NotFound />
    }
]; 