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
import "./App.css"

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Protected Routes */}
      <Route element={<ProtectedRoute role="student" />}>
        <Route path="/student/profile" element={<Profile />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin/participants" element={<Participants />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/certificates" element={<AdminCertificates />} />
      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
