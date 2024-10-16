import React from "react";
import { Link } from "react-router-dom";
import "./css/Sidebar.css";

const Sidebar = () => {
  return (
    // <div className="d-flex flex-column p-3 bg-light vh-100">
    <ul className="nav nav-pills flex-column mb-auto">
      <div id="d-flex justify-content-center align-items-center text-center flex-grow-1">
        <div id="nav-bar">
          <input id="nav-toggle" type="checkbox" />
          <div id="nav-content">
            <div class="nav-button">
              <label for="nav-toggle">
                <span id="nav-toggle-burger"></span>
              </label>
              <i class="fas fa-user"></i>
              <span>
                {" "}
                <li className="nav-item">
                  <Link to="/doctor/profile">Profile</Link>
                </li>
              </span>
            </div>
            <div class="nav-button">
              <i class="fas fa-calendar"></i>
              <span>
                <li className="nav-item">
                  <Link to="/doctor/appoinment">Appoinment</Link>
                </li>
              </span>
            </div>
            <div class="nav-button">
              <i class="fas fa-check-to-slot"></i>
              <span>
                <li className="nav-item">
                  <Link to="/doctor/Confirm-BookingSlots">
                    Confirm BookingSlots
                  </Link>
                </li>
              </span>
            </div>
            <hr />
            <div class="nav-button">
              <i class="fas fa-exchange-alt"></i>
              <span>
                <li className="nav-item">
                  <Link to="/doctor/transactions">Transactions</Link>
                </li>
              </span>
            </div>
            <div class="nav-button">
              <i class="fas fa-chart-line"></i>
              <span>
                <li className="nav-item">
                  <Link to="/doctor/todayappointments">
                    Today's Appointments
                  </Link>
                </li>
              </span>
            </div>

            <div class="nav-button">
              <i class="fas fa-sign-out"></i>
              <span>
                <li className="nav-item">
                  <Link to="/">Logout</Link>
                </li>
              </span>
            </div>
            <div id="nav-content-highlight"></div>
          </div>
        </div>
      </div>
    </ul>
    // </div>
  );
};

export default Sidebar;
