// src/components/Header.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../pages/auth/services/slice/authSlice";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  return (
    <header
      className="expand-lg  text-white"
      style={{ backgroundColor: "#008080" }}
    >
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h3">Wellness Flow</h1>
          <nav>
            <ul className="nav">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/contact">
                  Contact
                </Link>
              </li>

              {user ? (
                <li className="nav-item">
                  <span className="nav-link text-white" style={{cursor: "pointer"}} onClick={() => dispatch(logout())}>
                    Logout
                  </span>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/signin">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
