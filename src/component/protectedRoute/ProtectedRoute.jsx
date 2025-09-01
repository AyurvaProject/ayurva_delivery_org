import { Outlet } from "react-router-dom";
import { useAuthCheck } from "../../hooks/useAuthCheck";
const ProtectedRoute = ({ roles }) => {
  const requiredRole = roles?.[0];
  const { checking } = useAuthCheck(requiredRole);

  if (checking) {
    return <div>Loading...</div>;
  }
  return <Outlet />;
};

export default ProtectedRoute;
