import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingHome from "./pages/auth/LandingHome"; // Adjust path as per your project structure
import SignUp from "./pages/auth/SignUp"; // Adjust path as per your project structure
import LogIn from "./pages/auth/LogIn";
import Profile from "./pages/auth/Profile";
import DoctorHome from "./pages/doctor/DoctorHome";
import AdminHome from "./pages/admin/AdminHome";

const App = () => {
  return (
    <div className="dark">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LandingHome />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/signin" element={<LogIn />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/doctor" element={<DoctorHome />} />
          <Route exact path="/admin" element={<AdminHome />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
