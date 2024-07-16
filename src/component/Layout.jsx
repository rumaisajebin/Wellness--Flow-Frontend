// src/components/Layout.js
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="d-flex justify-content-center align-items-center text-center flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
