// src/components/Layout.js
import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './css/Sidebar.css'; 

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <div className="row flex-grow-1">
        <div className="col-2">
          <div className="d-flex flex-column p-3 bg-light vh-100">
            <ul className="nav nav-pills flex-column mb-auto sidebar-nav">
              <li className="nav-item mb-2">
                <Link to="/admin/dashboard" className="nav-link text-dark">
                  <i className="fas fa-tachometer-alt me-2"></i>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/list_doctors" className="nav-link text-dark">
                  <i className="fas fa-user-md me-2"></i>
                  Doctors
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/list_patients" className="nav-link text-dark">
                  <i className="fas fa-users me-2"></i>
                  Patients
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/list_appointments" className="nav-link text-dark">
                  <i className="fas fa-calendar-alt me-2"></i>
                  Appointments
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/list_reports" className="nav-link text-dark">
                  <i className="fas fa-file-alt me-2"></i>
                  Reports
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/" className="nav-link text-danger">
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-10">
          <main className="d-flex justify-content-center align-items-center text-center flex-grow-1">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
