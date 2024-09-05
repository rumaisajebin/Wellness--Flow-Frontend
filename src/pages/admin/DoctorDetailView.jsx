import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchDoctorById,
  blockUnblockDoctor,
  updateDoctorStatus,
  fetchVerificationChoices,
} from "./api/Api";
import {
  Button,
  Card,
  CardBody,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import Swal from "sweetalert2";
import AdminLayout from "../../component/AdminLayout";
import { useSelector } from "react-redux";

const DoctorDetailView = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [verificationChoices, setVerificationChoices] = useState({});
  const [selectedVerificationStatus, setSelectedVerificationStatus] =
    useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const { access } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const getDoctor = async () => {
      try {
        const response = await fetchDoctorById(id, access);
        setDoctor(response);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch doctor details.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    const getVerificationChoices = async () => {
      try {
        const response = await fetchVerificationChoices(access);
        setVerificationChoices(response);
        setSelectedVerificationStatus(response[0] || "");
      } catch (error) {
        console.error("Error fetching verification choices:", error);
      }
    };

    getDoctor();
    getVerificationChoices();
  }, [id, access]);

  const handleBlockUnblock = async (action) => {
    try {
      await blockUnblockDoctor(id, action, access);
      setDoctor({
        ...doctor,
        user: { ...doctor.user, is_active: action !== "block" },
      });
      Swal.fire({
        title: "Success",
        text: `Doctor has been ${action}ed.`,
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/admin/list_doctors");
    } catch (error) {
      Swal.fire("Error", `Failed to ${action} doctor.`, "error");
    }
  };

  const handleUpdateVerificationStatus = async () => {
    if (!selectedVerificationStatus) {
      Swal.fire("Error", "Please select a verification status.", "error");
      return;
    }

    try {
      await updateDoctorStatus(
        id,
        selectedVerificationStatus,
        access,
        rejectionReason
      );
      Swal.fire(
        "Status Updated",
        `Doctor has been ${selectedVerificationStatus}.`,
        "success"
      );
      navigate("/admin/list_doctors");
    } catch (error) {
      Swal.fire("Error", "Failed to update doctor status.", "error");
    }
  };

  const handleDownloadCertificates = async () => {
    try {
      const response = await fetch(
        `/api/DoctorProfile/${id}/download-certificates/`, // Use `id` here
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access}`, // Use the actual token
          },
        }
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `certificates_${id}.zip`; // Use `id` here
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        throw new Error("Failed to download certificates");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };
  

  if (!doctor) {
    return <div>Loading...</div>;
  }

    return (
      <AdminLayout>
        <div className="container mt-5">
          <h2 className="mb-4">{doctor.user.username}</h2>
          <Card>
            <CardBody>
              <Row>
                <Col md="4">
                  {doctor.profile_pic && (
                    <img
                      src={doctor.profile_pic}
                      alt="Profile Pic"
                      className="profile-pic img-fluid"
                      style={{ width: "100%", height: "auto" }}
                    />
                  )}
                </Col>
                <Col md="8" className="text-start">
                  <p>
                    <strong>ID:</strong> {doctor.id}
                  </p>
                  <p>
                    <strong>Name:</strong> {doctor.user.username}
                  </p>
                  <p>
                    <strong>Phone Number:</strong> {doctor.phone_number}
                  </p>
                  <p>
                    <strong>Address:</strong> {doctor.address}
                  </p>
                  <p>
                    <strong>Bio:</strong> {doctor.bio}
                  </p>
                  <p>
                    <strong>Medical License No:</strong>{" "}
                    {doctor.medical_license_no}
                  </p>
                  <p>
                    <strong>Specialization:</strong> {doctor.specialization}
                  </p>
                  <p>
                    <strong>Graduation Year:</strong> {doctor.graduation_year}
                  </p>
                  <p>
                    <strong>Years of Experience:</strong>{" "}
                    {doctor.years_of_experience}
                  </p>
                  <p>
                    <strong>Workplace Name:</strong> {doctor.workplace_name}
                  </p>
                  <p>
                    <strong>Verification Status:</strong>{" "}
                    {doctor.is_profile_verify}
                  </p>
                  {doctor.is_profile_verify === "denied" && (
                    <p>
                      <strong>Rejection Reason:</strong>{" "}
                      {doctor.rejection_reason || "N/A"}
                    </p>
                  )}
                  <p>
                    <strong>Blocked:</strong>{" "}
                    {doctor.user.is_active ? "No" : "Yes"}
                  </p>
                  <div>
                    <h4>Documents</h4>
                    {doctor.medical_license_certificate && (
                      <Button
                        className="m-1"
                        color="primary"
                        href={doctor.medical_license_certificate}
                        download
                      >
                        Download Medical License Certificate
                      </Button>
                    )}
                    {doctor.identification_document && (
                      <Button
                        className="m-1"
                        color="primary"
                        href={doctor.identification_document}
                        download
                      >
                        Download Identification Document
                      </Button>
                    )}
                    {doctor.certificates_degrees && (
                      <Button
                        className="m-1"
                        color="primary"
                        href={doctor.certificates_degrees}
                        download
                      >
                        Download Certificates/Degrees
                      </Button>
                    )}
                    {doctor.curriculum_vitae && (
                      <Button
                        className="m-1"
                        color="primary"
                        href={doctor.curriculum_vitae}
                        download
                      >
                        Download CV
                      </Button>
                    )}
                    {doctor.proof_of_work && (
                      <Button
                        className="m-1"
                        color="primary"
                        href={doctor.proof_of_work}
                        download
                      >
                        Download Proof of Work
                      </Button>
                    )}
                    {doctor.specialization_certificates && (
                      <Button
                        className="m-1"
                        color="primary"
                        href={doctor.specialization_certificates}
                        download
                      >
                        Download Specialization Certificates
                      </Button>
                    )}
                  </div>
                  <div className="mt-4">
                    {doctor.is_profile_verify !== "approved" && (
                      <>
                        <FormGroup>
                          <Label for="verificationStatus">
                            Verification Status
                          </Label>
                          <Input
                            type="select"
                            name="verificationStatus"
                            id="verificationStatus"
                            value={selectedVerificationStatus}
                            onChange={(e) =>
                              setSelectedVerificationStatus(e.target.value)
                            }
                          >
                            <option value="">Select Status</option>
                            {Object.entries(verificationChoices).map(
                              ([key, value]) => (
                                <option key={key} value={key}>
                                  {value}
                                </option>
                              )
                            )}
                          </Input>
                        </FormGroup>
                        {selectedVerificationStatus === "denied" && (
                          <FormGroup>
                            <Label for="rejectionReason">Rejection Reason</Label>
                            <Input
                              type="textarea"
                              name="rejectionReason"
                              id="rejectionReason"
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="Enter reason for rejection"
                            />
                          </FormGroup>
                        )}
                        <Button
                          className="m-1"
                          color="primary"
                          onClick={handleUpdateVerificationStatus}
                        >
                          Update Verification Status
                        </Button>
                      </>
                    )}
                    <Button
                      className="m-1"
                      color={doctor.user.is_active ? "danger" : "success"}
                      onClick={() =>
                        handleBlockUnblock(
                          doctor.user.is_active ? "block" : "unblock"
                        )
                      }
                    >
                      {doctor.user.is_active ? "Block" : "Unblock"}
                    </Button>
                  </div>
                </Col>
              </Row>
            </CardBody>
            <Button onClick={handleDownloadCertificates} color="primary">
              Download All Certificates
            </Button>
          </Card>
        </div>
      </AdminLayout>
    );
  };
  

export default DoctorDetailView;
