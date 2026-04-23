import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const ProtectedRoute = () => {
  const { accessToken, loading } = useContext(AuthContext);

  if (loading) {
    return <div><LoadingSpinner/></div>;
  }

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;