import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../pages/auth/services/slice/authSlice";
// import logo from "../assets/logo.png"; // Adjust the path to your logo
import "./css/Header.css";

const Header = () => {
  const { user, role } = useSelector((state) => state.auth);
  const isAuthenticated = useSelector((state) => !!state.auth.access);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  return (
    <header className="bg-teal text-white">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center py-3">
          <Link
            to="/"
            className="d-flex align-items-center text-white text-decoration-none"
          >
            {/* <img src={logo} alt="Logo" style={{ maxWidth: "50px", marginRight: "10px" }} /> */}
            <h1 className="h3 mb-0">Wellness Flow</h1>
          </Link>

          <nav className="navbar navbar-expand-lg navbar-light">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                {isAuthenticated && role === "doctor" ? (
                 
                 <li className="nav-item">
                 <Link className="nav-link text-white" to="/doctor/profile">
                   Dashboard
                 </Link>
               </li>
                ) : (
                  <li className="nav-item">
                  <Link className="nav-link text-white" to="/">
                    Home
                  </Link>
                </li>
                )}

                {isAuthenticated && role === "patient" && (
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/patient/profile">
                      Dashboard
                    </Link>
                  </li>
                )}
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
                    <span
                      className="nav-link text-white"
                      style={{ cursor: "pointer" }}
                      onClick={handleLogout}
                    >
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
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
