import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register"; // <-- import your registration page
import Login from "./pages/Login"; 
import ForgotPassword from "./pages/ForgotPassword"; 
import Programs from "./pages/Programs";
import ProgramDetails from "./pages/ProgramDetails";
import AIDashboard from "./components/HomeAIChat";
import FarmerDashboard from "./pages/FarmerDashboard";
import ReportComplaint from "./pages/ReportComplaint";
import MyContributions from "./pages/MyContributions";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} /> {/* Registration route */}
        <Route path="/login" element={<Login />} /> {/* Login route */}
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Forgot Password route */}
         <Route path="/programs" element={<Programs />} /> {/* Programs route */}
         <Route path="/programs/:id" element={<ProgramDetails />} />
         <Route path="/ai-chat" element={<AIDashboard />} />
         <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
         <Route path="/report-complaint" element={<ReportComplaint />} />
         <Route path="/my-contributions" element={<MyContributions />} />
         <Route path="/profile" element={<ProfilePage />} />


      </Routes>
    </Router>
  );
}

export default App;
