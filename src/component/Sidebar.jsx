import React from 'react';
import { Link } from 'react-router-dom';
import './css/Sidebar.css'; 

const Sidebar = () => {
  return (
    <div className="d-flex flex-column p-3 bg-light vh-100">
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/doctor/profile" className="nav-link active">
            Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/doctor/profile/update" className="nav-link ">
            profile update
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/doctor/appoinment" className="nav-link ">
            Appoinment
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/doctor/Confirm-BookingSlots" className="nav-link ">
          Confirm BookingSlots
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link danger">
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;