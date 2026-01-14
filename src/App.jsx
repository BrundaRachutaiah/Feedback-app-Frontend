import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppProvider } from "@shopify/app-bridge-react";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import FeedbackPage from "./pages/public/FeedbackPage";
import ThankYouPage from "./pages/public/ThankYouPage";
import Dashboard from "./pages/admin/Dashboard";
import CreateShop from "./pages/admin/CreateShop";
import EditShop from "./pages/admin/EditShop";
import FeedbackList from "./pages/admin/FeedbackList";
import ShopSettings from "./pages/admin/ShopSettings";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import ShopAnalytics from "./pages/admin/ShopAnalytics";
import GlobalAnalytics from "./pages/admin/GlobalAnalytics";
import RootRedirect from "./routes/RootRedirect";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Root */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public */}
          <Route path="/feedback/:shopId" element={<FeedbackPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin (Embedded Shopify App) */}
          <Route
            path="/admin/*"
            element={
              <ShopifyAppBridgeWrapper>
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              </ShopifyAppBridgeWrapper>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="shops" element={<Dashboard />} />
            <Route path="analytics" element={<GlobalAnalytics />} />
            <Route path="shop/:shopId/dashboard" element={<Dashboard />} />
            <Route path="shop/:shopId/analytics" element={<ShopAnalytics />} />
            <Route path="shop/:shopId/feedback" element={<FeedbackList />} />
            <Route path="shop/:shopId/settings" element={<ShopSettings />} />
            <Route path="create-shop" element={<CreateShop />} />
            <Route path="edit-shop/:shopId" element={<EditShop />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

/**
 * ✅ CORRECT App Bridge v4 Wrapper
 */
function ShopifyAppBridgeWrapper({ children }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const host =
    params.get("host") || window.localStorage.getItem("shopify_host");

  if (!host) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>App Bridge host missing.</p>
        <p>Please open this app from Shopify Admin.</p>
      </div>
    );
  }

  // Persist host across navigation
  window.localStorage.setItem("shopify_host", host);

  const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY;

  if (!apiKey) {
    return <div>Missing VITE_SHOPIFY_API_KEY</div>;
  }

  return (
    <AppProvider apiKey={apiKey} host={host} forceRedirect>
      {children}
    </AppProvider>
  );
}

export default App;