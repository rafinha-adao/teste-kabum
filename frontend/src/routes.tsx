import type { RouteObject } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import CustomerCreate from "./pages/customers/CustomerCreate";
import CustomerEdit from "./pages/customers/CustomerEdit";
import CustomersList from "./pages/customers/CustomersList";
import Login from "./pages/login/Login";
import NotFound from "./pages/NotFound";

export const routes: RouteObject[] = [
    { path: "/", element: <Dashboard /> },

    { path: "/login", element: <Login /> },

    { path: "/users", element: <CustomersList /> },
    { path: "/users/create", element: <CustomerCreate /> },
    { path: "/users/:id/edit", element: <CustomerEdit /> },

    { path: "/customers", element: <CustomersList /> },
    { path: "/customers/create", element: <CustomerCreate /> },
    { path: "/customers/:id/edit", element: <CustomerEdit /> },

    { path: "*", element: <NotFound /> }
]; 