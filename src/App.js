// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ================= PUBLIC PAGES ================= */
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
import ProfileCompletion from "./pages/ProfileCompletion";
import FieldsPage from "./pages/FieldsPage";
import HarvestsPage from "./pages/HarvestsPage";
import PestsPage from "./pages/PestsPage";
import WeatherPage from "./pages/WeatherPage";


/* ================= ADMIN PAGES ================= */
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminPrograms from "./pages/AdminPrograms";
import AdminContributions from "./pages/AdminContributions";
import AdminComplaints from "./pages/AdminComplaints";
import AdminReports from "./pages/AdminReports";

/* ================= LEADER ================= */
import LeaderNavLayout from "./pages/LeaderNavLayout";
import LeaderDashboard from "./pages/LeaderDashboard";
import LeaderComplaints from "./pages/LeaderComplaints";
import LeaderFarmers from "./pages/LeaderFarmers";
import LeaderPrograms from "./pages/LeaderPrograms";
import LeaderAgronomists from "./pages/LeaderAgronomist";

/* ================= AGRONOMIST ================= */
import AgronomistNavLayout from "./pages/AgronomistNavLayout";
import AgronomistDashboard from "./pages/AgronomistDashboard";
import AgronomistComplaints from "./pages/AgronomistComplaints";

/* ================= FINANCE ================= */
import FinanceNavLayout from "./pages/FinanceNavLayout";
import FinanceDashboard from "./pages/FinanceDashboard";
import ManageFundsPage from "./pages/ManageFundsPage";

/* ================= DONOR ================= */
import DonorNavLayout from "./pages/DonorNavLayout";
import DonorDashboard from "./pages/DonorDashboard";

function App() {
  const leaderUser = { name: "Leader User", role: "Leader" };
  const agronomistUser = { name: "Agronomist User", role: "Agronomist" };
  const financeUser = { name: "Finance User", role: "Finance" };
  const donorUser = { name: "Donor User", role: "Donor" };

  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
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
        <Route path="/completion" element={<ProfileCompletion />} />
        

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/programs/reports" element={<AdminReports />} />
        <Route path="/admin/users/farmers" element={<AdminUsers role="farmer" />} />
        <Route path="/admin/users/leaders" element={<AdminUsers role="leader" />} />
        <Route path="/admin/users/agronomists" element={<AdminUsers role="agronomist" />} />
        <Route path="/admin/users/donors" element={<AdminUsers role="donor" />} />
        <Route path="/admin/programs" element={<AdminPrograms />} />
        <Route path="/admin/programs/contributions" element={<AdminContributions />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
        <Route path="/admin/profile" element={<ProfilePage />} />

        {/* ================= LEADER ROUTES ================= */}
        <Route element={<LeaderNavLayout user={leaderUser} />}>
          <Route path="/leader" element={<LeaderDashboard />} />
          <Route path="/leader/profile" element={<ProfilePage currentUser={leaderUser} />} />
          <Route path="/leader/programs" element={<LeaderPrograms />} />
          <Route path="/leader/complaints" element={<LeaderComplaints />} />
          <Route path="/leader/farmers" element={<LeaderFarmers />} />
          <Route path="/leader/agronomist" element={<LeaderAgronomists />} />
        </Route>

        {/* ================= AGRONOMIST ROUTES ================= */}
        <Route element={<AgronomistNavLayout user={agronomistUser} />}>
          <Route path="/agronomist" element={<AgronomistDashboard />} />
          <Route path="/agronomist/complaints" element={<AgronomistComplaints />} />
        </Route>

        {/* ================= FINANCE ROUTES ================= */}
        <Route element={<FinanceNavLayout user={financeUser} />}>
          <Route path="/finance" element={<FinanceDashboard />} />
          <Route path="/finance/manage-funds" element={<ManageFundsPage />} />
          
        </Route>
        {/* ================= minicardsROUTES ================= */}
        <Route path="/farmer/fields" element={<FieldsPage />} />
        <Route path="/farmer/harvests" element={<HarvestsPage />} />
        <Route path="/farmer/pests" element={<PestsPage />} />
        <Route path="/farmer/weather" element={<WeatherPage />} />
        

        
        {/* ================= DONOR ROUTES ================= */}
        <Route element={<DonorNavLayout user={donorUser} />}>
          <Route path="/donor" element={<DonorDashboard />} />
          </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
