// src/components/Layout.js
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const DoctorLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      
      <div className="d-flex flex-row flex-grow-1  "> {/* Removed vh-100 here */}
        <div className="col-2">
          <Sidebar />
        </div>
        <div className="col-10 d-flex">
          <main className="d-flex justify-content-center align-items-center text-center flex-grow-1">
            {children}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorLayout;
