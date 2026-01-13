import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/admin/Dashboard";
import CreateShop from "../pages/admin/CreateShop";
import FeedbackList from "../pages/admin/FeedbackList";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/create-shop"
        element={
          <ProtectedRoute>
            <CreateShop />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/feedback/:shopId"
        element={
          <ProtectedRoute>
            <FeedbackList />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
