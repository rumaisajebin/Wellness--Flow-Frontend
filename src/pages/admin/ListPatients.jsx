import React, { useEffect, useState } from "react";
import { fetchAllPatients } from "./api/Api";
import { useSelector } from "react-redux";
import AdminLayout from "../../component/AdminLayout";
import { Table } from "reactstrap";
import { useNavigate } from "react-router-dom";

const ListPatients = () => {
  const { access } = useSelector((state) => state.auth);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  const fetchPatients = async () => {
    try {
      const response = await fetchAllPatients(access);
      console.log(response);
      setPatients(response);
    } catch (error) {
      console.error("Error fetching patients:", error);
      setError(
        "An error occurred while fetching patients. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/admin/patient-view/${id}`);
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <AdminLayout>
      <div className="container mt-5">
        <h2 className="mb-4">List of Patients</h2>
        <Table bordered hover className="table-rounded">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Age</th>
              <th>Phone Number</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="table-white">
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.full_name}</td>
                <td>{patient.age}</td>
                <td>{patient.phone_number}</td>
                <td>{patient.gender}</td>
                <td>{patient.address}</td>
                <td>
                  <span
                    className="text-dark fw-bold"
                    style={{ cursor: "pointer", color: "black" }}
                    onClick={() => handleViewDetails(patient.id)}
                  >
                    View
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {/* </AdminLayout> */}
    </AdminLayout>
  );
};

export default ListPatients;
