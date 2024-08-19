import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProfile, getProfileId, updateProfile } from "./serivices/api"; // Adjust the path as needed
import { Card, CardBody, Row, Col, Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import PatientLayout from "../../component/PatientLayout";

const ProfileUpdate = () => {
  const token = useSelector((state) => state.auth.access);
  const [profile, setProfile] = useState({
    profile_pic: "",
    full_name: "",
    date_of_birth: "",
    age: "",
    phone_number: "",
    gender: "",
    address: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [id, setId] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const fetchPatientId = async () => {
    try {
      const data = await getProfileId(token);
      setId(data.id);
    } catch (error) {
      setError("Failed to fetch patient ID.");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPatientId();
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setProfile({
      ...profile,
      [name]: files ? files[0] : value
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!profile.full_name) errors.full_name = "Please add your name.";
    if (!profile.date_of_birth) errors.date_of_birth = "Please add your date of birth.";
    if (!profile.age || profile.age <= 0) errors.age = "Please enter a valid age.";
    if (!profile.phone_number) errors.phone_number = "Please add your phone number.";
    if (!profile.gender) errors.gender = "Please select your gender.";
    if (!profile.address) errors.address = "Please add your address.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    for (const key in profile) {
      if (profile[key] instanceof File) {
        formData.append(key, profile[key]);
      } else {
        formData.append(key, profile[key]);
      }
    }
    try {
      await updateProfile(id, formData, token);
      setSuccess("Profile updated successfully.");
    } catch (error) {
      setError("Failed to update profile.");
      console.log(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PatientLayout>
      <div className="container mt-5">
        {success && <Alert color="success">{success}</Alert>}
        {error && <Alert color="danger">{error}</Alert>}
        <Card>
          <CardBody>
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label for="profile_pic">Profile Picture</Label>
                    <Input
                      type="file"
                      name="profile_pic"
                      id="profile_pic"
                      onChange={handleChange}
                      accept="image/*"
                    />
                    {profile.profile_pic && typeof profile.profile_pic === "string" ? (
                      <div className="mt-3">
                        <img
                          src={profile.profile_pic}
                          alt="Profile"
                          style={{ maxWidth: "200px", maxHeight: "200px" }}
                        />
                      </div>
                    ) : (
                      profile.profile_pic instanceof File && (
                        <div className="mt-3">
                          <img
                            src={URL.createObjectURL(profile.profile_pic)}
                            alt="Profile"
                            style={{ maxWidth: "200px", maxHeight: "200px" }}
                          />
                        </div>
                      )
                    )}
                  </FormGroup>
                </Col>
                <Col md="8">
                  <FormGroup>
                    <Label for="full_name">Full Name</Label>
                    <Input
                      type="text"
                      name="full_name"
                      id="full_name"
                      value={profile.full_name}
                      onChange={handleChange}
                    />
                    {validationErrors.full_name && <div className="text-danger">{validationErrors.full_name}</div>}
                  </FormGroup>
                  <FormGroup>
                    <Label for="date_of_birth">Date of Birth</Label>
                    <Input
                      type="date"
                      name="date_of_birth"
                      id="date_of_birth"
                      value={profile.date_of_birth}
                      onChange={handleChange}
                    />
                    {validationErrors.date_of_birth && <div className="text-danger">{validationErrors.date_of_birth}</div>}
                  </FormGroup>
                  <FormGroup>
                    <Label for="age">Age</Label>
                    <Input
                      type="number"
                      name="age"
                      id="age"
                      value={profile.age}
                      onChange={handleChange}
                    />
                    {validationErrors.age && <div className="text-danger">{validationErrors.age}</div>}
                  </FormGroup>
                  <FormGroup>
                    <Label for="phone_number">Phone Number</Label>
                    <Input
                      type="text"
                      name="phone_number"
                      id="phone_number"
                      value={profile.phone_number}
                      onChange={handleChange}
                    />
                    {validationErrors.phone_number && <div className="text-danger">{validationErrors.phone_number}</div>}
                  </FormGroup>
                  <FormGroup>
                    <Label for="gender">Gender</Label>
                    <Input
                      type="select"
                      name="gender"
                      id="gender"
                      value={profile.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Input>
                    {validationErrors.gender && <div className="text-danger">{validationErrors.gender}</div>}
                  </FormGroup>
                  <FormGroup>
                    <Label for="address">Address</Label>
                    <Input
                      type="textarea"
                      name="address"
                      id="address"
                      value={profile.address}
                      onChange={handleChange}
                    />
                    {validationErrors.address && <div className="text-danger">{validationErrors.address}</div>}
                  </FormGroup>
                  <Button color="primary" type="submit">
                    Update Profile
                  </Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    </PatientLayout>
  );
};

export default ProfileUpdate;
