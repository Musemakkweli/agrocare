import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register"; // <-- import your registration page
import Login from "./pages/Login"; 
import ForgotPassword from "./pages/ForgotPassword"; 
import Programs from "./pages/Programs";
import ProgramDetails from "./pages/ProgramDetails";

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

      </Routes>
    </Router>
  );
}

export default App;
