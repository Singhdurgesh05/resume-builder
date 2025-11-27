import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center p-4">Loading...</p>;

  if (!user) return <Navigate to="/signin" replace />;

  return children;
};

export default ProtectedRoute;
