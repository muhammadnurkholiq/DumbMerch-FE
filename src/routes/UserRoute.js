import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";

// userContext
import { AuthContext } from "../context/AuthContext";

export default function UserRoute() {
  const [state] = useContext(AuthContext);

  const UserLogin = state.UserLogin;

  return UserLogin ? <Outlet /> : <Navigate to="/" />;
}
