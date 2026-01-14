// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

          {/* PUBLIC */}
          <Route path="/feedback/:shopId" element={<FeedbackPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* GLOBAL ADMIN */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="shops" element={<Dashboard />} />
            <Route path="analytics" element={<GlobalAnalytics />} />

            {/* SHOP CONTEXT (NEW – SAFE) */}
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

export default App;