import { Navigate } from "react-router-dom";

function RootRedirect() {
  const params = new URLSearchParams(window.location.search);
  const host = params.get("host");

  // ✅ Shopify embedded app
  if (host) {
    return <Navigate to="/admin" replace />;
  }

  // ✅ Normal web user
  return <Navigate to="/login" replace />;
}

export default RootRedirect;
