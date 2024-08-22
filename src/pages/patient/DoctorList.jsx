import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import PatientLayout from "../../component/PatientLayout";

const BASE_URL = "http://127.0.0.1:8000/patient";

const DoctorList = () => {
  const { access } = useSelector((state) => state.auth);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  let userId;

  if (access) {
    try {
      userId = jwtDecode(access).user_id;
    } catch (e) {
      setError("Invalid token");
    }
  } else {
    setError("No access token provided");
  }

  useEffect(() => {
    const fetchDoctors = async () => {
      if (access) {
        try {
          const response = await axios.get(
            `${BASE_URL}/doctor-profiles/verified/`,
            {
              headers: {
                Authorization: `Bearer ${access}`,
              },
            }
          );
          setDoctors(response.data);
        } catch (err) {
          setError(err.message || "Error fetching doctors");
        }
      }
    };

    fetchDoctors();
  }, [access]);

  const getOffsetClass = (remainingDoctors) => {
    if (remainingDoctors === 1) return "offset-md-3";
    if (remainingDoctors === 2) return "offset-md-2";
    if (remainingDoctors === 3) return "offset-md-1";
    return "";
  };

  return (
    <PatientLayout>
      <div className="container">
        <h2 className="my-4">Verified Doctors</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row">
          {doctors.map((doctor, index) => {
            const isLastRow =
              Math.floor(index / 4) === Math.floor((doctors.length - 1) / 4);
            const remainingDoctors = doctors.length % 4;
            const offsetClass =
              isLastRow && remainingDoctors !== 0
                ? getOffsetClass(remainingDoctors)
                : "";

            return (
              <div
                key={doctor.id}
                className={`col-md-3 mb-4 ${index % 4 === 0 && offsetClass}`}
              >
                <div className="card h-100">
                  <img
                    src={doctor.profile_pic}
                    alt={doctor.full_name}
                    className="card-img-top"
                    style={{
                      width: "100%",
                      height: "250px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{doctor.full_name}</h5>
                    <p className="card-text">{doctor.specialization}</p>
                    <Link to={`/patient/view-doctor/${doctor.id}`}>
                      <button className="btn btn-primary">View Details</button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PatientLayout>
  );
};

export default DoctorList;
