// src/components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer
      className="bg-teal  text-white text-center p-4 mt-auto"
      style={{ backgroundColor: "#008080" }}
    >
      <div className="container ">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <img
              src="/path/to/logo.png"
              alt="Logo"
              style={{ maxWidth: "100px" }}
            />
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <h5>Contact Us</h5>
            <p>123 Main St, Anytown, USA</p>
            <p>Email: contact@example.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          <div className="col-md-4">
            <h5>Reports</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/reports/annual" className="text-white">
                  Annual Report
                </a>
              </li>
              <li>
                <a href="/reports/financial" className="text-white">
                  Financial Report
                </a>
              </li>
              <li>
                <a href="/reports/sustainability" className="text-white">
                  Sustainability Report
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
