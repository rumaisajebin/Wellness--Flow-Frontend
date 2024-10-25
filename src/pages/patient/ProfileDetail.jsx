import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProfile, getProfileId } from "./serivices/api"; // Adjust the path as needed
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import Layout from "../../component/Layout";
import PatientLayout from "../../component/PatientLayout";
import LoadingAnimation from "../../component/LoadingAnimation";
import { useNavigate } from "react-router-dom";

const ProfileDetail = () => {
  const token = useSelector((state) => state.auth.access);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [id, setId] = useState(null);

  const fetchPtientId = async () => {
    try {
      const data = await getProfileId(token);
      setId(data.id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPtientId();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchProfile = async () => {
        try {
          const profileData = await getProfile(id, token);
          setProfile(profileData);
        } catch (error) {
          setError("Failed to fetch profile details.");
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [id]);

  if (loading) return <LoadingAnimation />;
  if (error) return <div>{error}</div>;

  // Check if all profile fields are empty
  const isProfileEmpty = profile && Object.values(profile).every(
    (field) => !field || (typeof field === "string" && field.trim() === "")
  );
  
  console.log("Is profile empty:", isProfileEmpty); // Log profile empty status
  console.log("Profile data:", profile); // Log full profile data

  if (isProfileEmpty) {
    return (
      <PatientLayout>
        <div className="container mt-5 text-center">
          <p>No profile data available. Would you like to create a profile?</p>
          <Button
            color="primary"
            onClick={() => navigate("/patient/profile/create")}
          >
            Create Profile
          </Button>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="container mt-5">
        <Card>
          <CardBody>
            <Row>
              <Col md="4">
                {profile.profile_pic && (
                  <img
                    src={profile.profile_pic}
                    alt="Profile Pic"
                    className="img-fluid"
                  />
                )}
              </Col>
              <Col md="8">
                <p>
                  <strong>Full Name:</strong> {profile.full_name}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {profile.date_of_birth}
                </p>
                <p>
                  <strong>Age:</strong> {profile.age}
                </p>
                <p>
                  <strong>Phone Number:</strong> {profile.phone_number}
                </p>
                <p>
                  <strong>Gender:</strong> {profile.gender}
                </p>
                <p>
                  <strong>Address:</strong> {profile.address}
                </p>

                {/* If needed, add download links for documents */}
                {/* Example for profile_pic */}
                {/* {profile.profile_pic && (
                <Button color="primary" href={profile.profile_pic} download>
                  Download Profile Picture
                </Button>
              )} */}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    </PatientLayout>
  );
};

export default ProfileDetail;
