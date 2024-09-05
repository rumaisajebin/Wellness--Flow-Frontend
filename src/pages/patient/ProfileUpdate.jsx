import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { getProfile, getProfileId, updateProfile } from "./serivices/api"; // Adjust the path as needed
import { Card, CardBody, Row, Col, Button, FormGroup, Label, Input, Alert } from "reactstrap";
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

  const { control, handleSubmit, setValue, formState: { errors } } = useForm();

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
          Object.keys(profileData).forEach((key) => setValue(key, profileData[key]));
        } catch (error) {
          setError("Failed to fetch profile details.");
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    console.log(formData);
    for (const key in data) {
      formData.append(key, data[key]);
    }
    
    try {
      await updateProfile(id, formData, token);
      setSuccess("Profile updated successfully.");
      console.log(setSuccess);
      
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
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label for="profile_pic">Profile Picture</Label>
                    <Controller
                      name="profile_pic"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Input
                            type="file"
                            id="profile_pic"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              field.onChange(file);
                            }}
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
                        </>
                      )}
                    />
                  </FormGroup>
                </Col>
                <Col md="8">
                  <FormGroup>
                    <Label for="full_name">Full Name</Label>
                    <Controller
                      name="full_name"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Input
                            type="text"
                            id="full_name"
                            placeholder="Enter your full name"
                            {...field}
                          />
                          {errors.full_name && <div className="text-danger">{errors.full_name.message}</div>}
                        </>
                      )}
                      rules={{ required: "Please add your name." }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="date_of_birth">Date of Birth</Label>
                    <Controller
                      name="date_of_birth"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Input
                            type="date"
                            id="date_of_birth"
                            placeholder="Select your date of birth"
                            {...field}
                          />
                          {errors.date_of_birth && <div className="text-danger">{errors.date_of_birth.message}</div>}
                        </>
                      )}
                      rules={{ required: "Please add your date of birth." }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="age">Age</Label>
                    <Controller
                      name="age"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Input
                            type="number"
                            id="age"
                            placeholder="Enter your age"
                            {...field}
                          />
                          {errors.age && <div className="text-danger">{errors.age.message}</div>}
                        </>
                      )}
                      rules={{ required: "Please enter a valid age.", min: 1 }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="phone_number">Phone Number</Label>
                    <Controller
                      name="phone_number"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Input
                            type="text"
                            id="phone_number"
                            placeholder="Enter your phone number"
                            {...field}
                          />
                          {errors.phone_number && <div className="text-danger">{errors.phone_number.message}</div>}
                        </>
                      )}
                      rules={{ required: "Please add your phone number." }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="gender">Gender</Label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Input
                            type="select"
                            id="gender"
                            placeholder="Select your gender"
                            {...field}
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </Input>
                          {errors.gender && <div className="text-danger">{errors.gender.message}</div>}
                        </>
                      )}
                      rules={{ required: "Please select your gender." }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="address">Address</Label>
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Input
                            type="textarea"
                            id="address"
                            placeholder="Enter your address"
                            {...field}
                          />
                          {errors.address && <div className="text-danger">{errors.address.message}</div>}
                        </>
                      )}
                      rules={{ required: "Please add your address." }}
                    />
                  </FormGroup>
                  <Button color="primary" type="submit">
                    Update Profile
                  </Button>
                </Col>
              </Row>
            </form>
          </CardBody>
        </Card>
      </div>
    </PatientLayout>
  );
};

export default ProfileUpdate;
