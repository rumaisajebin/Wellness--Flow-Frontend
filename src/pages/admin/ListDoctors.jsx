import React, { useEffect, useState } from "react";
import { fetchAllDoctors } from "./api/Api";
import { useSelector } from "react-redux";
import { Button, Table } from "reactstrap";
import Swal from "sweetalert2";
import AdminLayout from "../../component/AdminLayout";
import { useNavigate } from "react-router-dom";

const ListDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const { access } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const getDoctors = async () => {
      try {
        const response = await fetchAllDoctors(access);
        setDoctors(response);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch doctor profiles.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    getDoctors();
  }, [access]);

  const handleViewDetails = (id) => {
    navigate(`/admin/doctor-view/${id}`);
  };

  return (
    <AdminLayout>
      <div className="container mt-5">
        <h2 className="mb-4">List of Doctors</h2>
        <Table bordered hover className="table-rounded">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Specialization</th>
              <th>Workplace Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="table-white">
            {doctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.id || "-"}</td>
                <td>{doctor.user?.username || "-"}</td>
                <td>{doctor.phone_number || "-"}</td>
                <td>{doctor.specialization || "-"}</td>
                <td>{doctor.workplace_name || "-"}</td>
                <td>{doctor.is_profile_verify || "-"}</td>
                <td>
                  <span
                    className="text-dark fw-bold"
                    style={{ cursor: "pointer", color: "black" }}
                    onClick={() => handleViewDetails(doctor.id)}
                  >
                    View
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </AdminLayout>
  );
};
export default ListDoctors;
