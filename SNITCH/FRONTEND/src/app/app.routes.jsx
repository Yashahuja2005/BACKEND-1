import { createBrowserRouter, Navigate } from "react-router";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <h1>Home Page</h1>
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "*",
        element: <Navigate to="/register" replace />
    }
])
