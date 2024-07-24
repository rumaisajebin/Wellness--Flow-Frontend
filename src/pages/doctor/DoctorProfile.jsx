import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardBody, CardTitle, Row, Col, Button } from 'reactstrap';

const DoctorProfile = ({ access, BASE_URL }) => {
  const [profile, setProfile] = useState(null);
  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const fetchProfileId = async () => {
      try {
        const response = await axios.get(`${BASE_URL}doctor/doctor-profiles/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        console.log("log", response);
        if (response.data.length > 0) {
          setProfileId(response.data[0].id);
        } else {
          console.error("No profiles found");
        }
      } catch (error) {
        console.error("Error fetching profile ID:", error);
      }
    };

    fetchProfileId();
  }, [BASE_URL, access]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (profileId) {
        try {
          const response = await axios.get(`${BASE_URL}doctor/doctor-profiles/${profileId}/`, {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          });
          setProfile(response.data);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
    };

    fetchProfileData();
  }, [BASE_URL, access, profileId]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="doctor-profile-page">
      <Card>
        <CardBody>
          <Row>
            <Col md="4">
              <img src={profile.profile_pic} alt="Profile Pic" className="profile-pic" />
            </Col>
            <Col md="8">
              <p><strong>Full Name:</strong> {profile.full_name}</p>
              <p><strong>Phone Number:</strong> {profile.phone_number}</p>
              <p><strong>Address:</strong> {profile.address}</p>
              <p><strong>Bio:</strong> {profile.bio}</p>
              <p><strong>Medical License No:</strong> {profile.medical_license_no}</p>
              <p><strong>Specialization:</strong> {profile.specialization}</p>
              <p><strong>Graduation Year:</strong> {profile.graduation_year}</p>
              <p><strong>Years of Experience:</strong> {profile.years_of_experience}</p>
              <p><strong>Workplace Name:</strong> {profile.workplace_name}</p>
              <p><strong>Verification Status:</strong> {profile.is_verify ? 'Verified' : 'Not Verified'}</p>
              <p><strong>Blocked:</strong> {profile.is_block ? 'Yes' : 'No'}</p>
              <Button color="primary" href={profile.medical_license_certificate} download>Download Medical License Certificate</Button>
              <Button color="primary" href={profile.identification_document} download>Download Identification Document</Button>
              <Button color="primary" href={profile.certificates_degrees} download>Download Certificates/Degrees</Button>
              <Button color="primary" href={profile.curriculum_vitae} download>Download CV</Button>
              <Button color="primary" href={profile.proof_of_work} download>Download Proof of Work</Button>
              <Button color="primary" href={profile.specialization_certificates} download>Download Specialization Certificates</Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default DoctorProfile;
