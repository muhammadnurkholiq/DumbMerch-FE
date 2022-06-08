import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";

// userContext
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute() {
  const [state] = useContext(AuthContext);

  const AdminLogin = state.AdminLogin;

  return AdminLogin ? <Outlet /> : <Navigate to="/" />;
}
