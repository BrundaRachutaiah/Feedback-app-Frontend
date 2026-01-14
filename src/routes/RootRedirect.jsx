import { Navigate } from "react-router-dom";

function RootRedirect() {
  // Always go to admin dashboard
  return <Navigate to="/admin/dashboard" replace />;
}

export default RootRedirect;