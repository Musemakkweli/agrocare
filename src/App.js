import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Programs from "./pages/Programs";
import ProgramDetails from "./pages/ProgramDetails";
import DonatePage from "./pages/DonatePage";
import AIDashboard from "./components/HomeAIChat";
import FarmerDashboard from "./pages/FarmerDashboard";
import ReportComplaint from "./pages/ReportComplaint";
import MyFunds from "./pages/MyFunds";
import ProfilePage from "./pages/ProfilePage";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminPrograms from "./pages/AdminPrograms";
import AdminContributions from "./pages/AdminContributions";
import AdminComplaints from "./pages/AdminComplaints";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:id" element={<ProgramDetails />} />
        <Route path="/donate/:id" element={<DonatePage />} />
        <Route path="/ai-chat" element={<AIDashboard />} />
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/report-complaint" element={<ReportComplaint />} />
        <Route path="/my-funds" element={<MyFunds />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} /> {/* /admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* User management by role */}
        <Route path="/admin/users/farmers" element={<AdminUsers role="farmer" />} />
        <Route path="/admin/users/leaders" element={<AdminUsers role="leader" />} />
        <Route path="/admin/users/agronomists" element={<AdminUsers role="agronomist" />} />
        <Route path="/admin/users/donors" element={<AdminUsers role="donor" />} />

        {/* Programs & contributions */}
        <Route path="/admin/programs" element={<AdminPrograms />} />
        <Route path="/admin/programs/contributions" element={<AdminContributions />} />

        {/* Complaints */}
        <Route path="/admin/complaints" element={<AdminComplaints />} />

        {/* Profile */}
        <Route path="/admin/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
