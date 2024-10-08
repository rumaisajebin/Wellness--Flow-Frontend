// src/components/Layout.js
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column vh-100">
      <Header />

      {/* <div className="col-10"> */}
          <main className="d-flex justify-content-center align-items-center text-center flex-grow-1">
            {children}
          </main>
        {/* </div> */}

      <Footer />
    </div>
  );
};

export default Layout;
