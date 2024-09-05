import React, { useEffect, useState } from "react";
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import { useSelector } from "react-redux";
import { docProfile } from "./services/api";
import DoctorLayout from "../../component/DoctorLayout";
import { Link } from "react-router-dom";

const DoctorProfile = () => {
  const token = useSelector((state) => state.auth.access);
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const data = await docProfile(token);
      setProfile(data[0]);
    } catch (error) {
      console.error("Error fetching profile ID:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <DoctorLayout>
      <div className="doctor-profile-page p-3">
        <Card>
          <CardBody>
            <Row>
              <Col md="4">
                <img
                  src={profile.profile_pic}
                  alt="Profile Pic"
                  className="profile-pic img-fluid"
                />
              </Col>
              <Col md="8" className="text-start">
                <p>
                  <strong>Full Name:</strong> {profile.full_name}
                </p>
                <p>
                  <strong>Phone Number:</strong> {profile.phone_number}
                </p>
                <p>
                  <strong>Address:</strong> {profile.address}
                </p>
                <p>
                  <strong>Bio:</strong> {profile.bio}
                </p>
                <p>
                  <strong>Fee:</strong> {profile.fee}
                </p>
                <p>
                  <strong>Medical License No:</strong>{" "}
                  {profile.medical_license_no}
                </p>
                <p>
                  <strong>Specialization:</strong> {profile.specialization}
                </p>
                <p>
                  <strong>Graduation Year:</strong> {profile.graduation_year}
                </p>
                <p>
                  <strong>Years of Experience:</strong>{" "}
                  {profile.years_of_experience}
                </p>
                <p>
                  <strong>Workplace Name:</strong> {profile.workplace_name}
                </p>
                <p>
                  <strong>Verification Status:</strong>{" "}
                  {profile.is_verify ? "Verified" : "Not Verified"}
                </p>
                {/* <p>
                  <strong>Blocked:</strong> {profile.is_block ? "Yes" : "No"}
                </p> */}
                <Button
                  className="m-1"
                  color="primary"
                  href={profile.medical_license_certificate}
                  download
                >
                  Download Medical License Certificate
                </Button>
                <Button
                  className="m-1"
                  color="primary"
                  href={profile.identification_document}
                  download
                >
                  Download Identification Document
                </Button>
                <Button
                  className="m-1"
                  color="primary"
                  href={profile.certificates_degrees}
                  download
                >
                  Download Certificates/Degrees
                </Button>
                <Button
                  className="m-1"
                  color="primary"
                  href={profile.curriculum_vitae}
                  download
                >
                  Download CV
                </Button>
                <Button color="primary" href={profile.proof_of_work} download>
                  Download Proof of Work
                </Button>
                <Button
                  className="m-1"
                  color="primary"
                  href={profile.specialization_certificates}
                  download
                >
                  Download Specialization Certificates
                </Button>
              </Col>
              <Link to={`/doctor/profile/update`}>
                <Button className="m-1" color="primary">
                  Edit
                </Button>
              </Link>
            </Row>
          </CardBody>
        </Card>
      </div>
    </DoctorLayout>
  );
};

export default DoctorProfile;
