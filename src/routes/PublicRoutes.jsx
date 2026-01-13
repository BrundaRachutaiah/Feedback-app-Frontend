import { Route, Routes } from "react-router-dom";
import FeedbackPage from "../pages/public/FeedbackPage";
import ThankYouPage from "../pages/public/ThankYouPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

const PublicRoutes = () => {
  return (
    <Routes>
      {/* QR → Feedback */}
      <Route path="/feedback/:shopId" element={<FeedbackPage />} />

      {/* After submit */}
      <Route path="/thank-you" element={<ThankYouPage />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default PublicRoutes;
