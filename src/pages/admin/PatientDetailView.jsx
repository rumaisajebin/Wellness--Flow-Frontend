import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchPatientById, blockUnblockPatient } from "./api/Api";
import { Card, CardBody, Col, Row, Button } from "reactstrap";
import Swal from "sweetalert2";
import AdminLayout from "../../component/AdminLayout";

const PatientDetailView = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const { access } = useSelector((state) => state.auth);

  useEffect(() => {
    const getPatient = async () => {
      try {
        const response = await fetchPatientById(id, access);
        setPatient(response);
      } catch (error) {
        console.error("Error fetching patient details:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch patient details.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    getPatient();
  }, [id, access]);

  const handleBlockUnblock = async (action) => {
    try {
      await blockUnblockPatient(id, action, access);
      setPatient({ ...patient, user: { ...patient.user, is_active: action !== 'block' } });
      Swal.fire({
        title: "Success",
        text: `Patient has been ${action}ed.`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error(`Error ${action}ing patient:`, error);
      Swal.fire({
        title: "Error",
        text: `Failed to ${action} patient.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (!patient) return <p>Loading...</p>;

  return (
    <AdminLayout>
      <div className="container mt-5">
        <h2 className="mb-4">{patient.full_name}</h2>
        <Card>
          <CardBody>
            <Row>
              <Col md="4">
                {patient.profile_pic && (
                  <img
                    src={patient.profile_pic}
                    alt="patient_pic"
                    className="profile-pic img-fluid"
                    style={{ width: "100%", height: "auto" }}
                  />
                )}
              </Col>
              <Col md="8" className="text-start">
                <p>
                  <strong>ID:</strong> {patient.id}
                </p>
                <p>
                  <strong>Name:</strong> {patient.full_name}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {patient.date_of_birth}
                </p>
                <p>
                  <strong>Age:</strong> {patient.age}
                </p>
                <p>
                  <strong>Phone Number:</strong> {patient.phone_number}
                </p>
                <p>
                  <strong>Gender:</strong> {patient.gender}
                </p>
                <p>
                  <strong>Address:</strong> {patient.address}
                </p>
                <p>
                  <strong>Status:</strong> {patient.user.is_active ? "Active" : "Blocked"}
                </p>
                <Button
                  color={patient.user.is_active ? "danger" : "success"}
                  onClick={() => handleBlockUnblock(patient.user.is_active ? "block" : "unblock")}
                >
                  {patient.user.is_active ? "Block" : "Unblock"}
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default PatientDetailView;
