// src/components/Layout.js
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './css/Sidebar.css'; 
import { Link } from "react-router-dom";

const PatientLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <div className="row m-0">
        <div className="col-2">
        <div className="d-flex flex-column p-3 bg-light vh-100">
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/patient/profile" className="nav-link active">
            Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/patient/profile/create" className="nav-link">
            Profile Create
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/patient/profile/update" className="nav-link ">
            profile Update
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/patient/booking" className="nav-link ">
            Booking
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link danger">
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

export default PatientLayout;
