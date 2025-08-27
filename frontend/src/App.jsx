import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/student/Profile";
import Participants from "./pages/admin/Participants";
import Settings from "./pages/admin/Settings";
import AdminCertificates from "./pages/admin/AdminCertificates";
import ProtectedRoute from "./components/ProtectedRoute";
import Events from "./pages/admin/Events";
import { Elements } from "@stripe/react-stripe-js";
import StudentEvents from "./pages/student/Events"
import { loadStripe } from "@stripe/stripe-js";
import "./App.css"
import PaymentSuccess from "./pages/PaymentSuccess";
import PublicRoute from "./components/PublicRoute";

const stripePromise = loadStripe(import.meta.env.VITE_Stripe_Publishable_key);

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Student Protected Routes */}
        <Route element={<ProtectedRoute role="student" />}>
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/events" element={<StudentEvents />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />

        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin/participants" element={<Participants />} />
          <Route path="/admin/events" element={<Events />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/certificates" element={<AdminCertificates />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Elements>
  );
}

export default App;
