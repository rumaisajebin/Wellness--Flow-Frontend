import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../component/Layout";
import DoctorImg from "../../assets/images/Hospital-Management-Software.jpg";

const LandingHome = () => {
  return (
    <Layout>
      <div className="d-flex justify-content-center align-items-center vh-70">
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-flex flex-column justify-content-center text-start">
              <h2>App That Provides a Complete Health Care Solution</h2>
              <p>
                Are you seeking compassionate and expert medical care? Look no
                further! Our doctor landing page is designed to be your gateway
                to exceptional healthcare services. Whether you're in need of
                routine check-ups.
              </p>
              <div>
                <Link
                  className="btn btn-primary"
                  to={"/SignUp"}
                  style={{
                    backgroundColor: "#008080",
                    borderColor: "#008080",
                    borderRadius: "0.25rem",
                  }}
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className="col-md-6 d-flex justify-content-center align-items-center">
              <img src={DoctorImg} alt="Health Care" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LandingHome;
