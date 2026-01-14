import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Provider as AppBridgeProvider } from "@shopify/app-bridge-react"; // ✅ Import Provider
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

          {/* ROOT (SMART REDIRECT) */}
          <Route path="/" element={<RootRedirect />} />

          {/* PUBLIC ROUTES (Do not use App Bridge here) */}
          <Route path="/feedback/:shopId" element={<FeedbackPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />

          {/* AUTH ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ADMIN ROUTES (Wrapped in Shopify App Bridge) */}
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
            {/* Redirect /admin to /admin/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* GLOBAL ADMIN */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="shops" element={<Dashboard />} />
            <Route path="analytics" element={<GlobalAnalytics />} />

            {/* SHOP CONTEXT */}
            <Route path="shop/:shopId/dashboard" element={<Dashboard />} />
            <Route path="shop/:shopId/analytics" element={<ShopAnalytics />} />
            <Route path="shop/:shopId/feedback" element={<FeedbackList />} />
            <Route path="shop/:shopId/settings" element={<ShopSettings />} />

            {/* CRUD */}
            <Route path="create-shop" element={<CreateShop />} />
            <Route path="edit-shop/:shopId" element={<EditShop />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

// ✅ HELPER COMPONENT: Initializes Shopify App Bridge safely
function ShopifyAppBridgeWrapper({ children }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  // 1. Try to get 'host' from URL (passed by backend)
  // 2. Fallback to localStorage (if user refreshes the page)
  const host = params.get("host") || window.localStorage.getItem("shopify_host");

  if (host) {
    // Save host for persistence
    window.localStorage.setItem("shopify_host", host);

    const config = {
      apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
      host: host,
      forceRedirect: true,
    };

    return <AppBridgeProvider config={config}>{children}</AppBridgeProvider>;
  }

  // If no host is found, show a message or redirect to login (if outside Shopify)
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <p>App Bridge Configuration Missing.</p>
      <p>Please open this app via the Shopify Admin.</p>
    </div>
  );
}

export default App;