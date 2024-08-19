import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { getProfileId, getProfile, updateProfile, createProfile } from "./serivices/api"; // Ensure the path is correct

const PatientProfileCreate = () => {
  const navigate = useNavigate();
  const { access } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    age: "",
    phone_number: "",
    gender: "",
    address: "",
    profile_pic: null,
  });

  const [profileId, setProfileId] = useState(null);

  useEffect(() => {
    const fetchProfileId = async () => {
      try {
        const profile = await getProfileId(access);
        setProfileId(profile.id);
        const profileDetails = await getProfile(profile.id, access);
        setFormData(profileDetails);
      } catch (error) {
        console.error("Error fetching profile ID:", error);
        showAlert("Error", "Failed to fetch profile ID.");
      }
    };

    fetchProfileId();
  }, [access]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files && files.length > 0 ? files[0] : value,
    });
  };

  const showAlert = (title, text, icon = "info") => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: "OK",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      for (const key in formData) {
        formDataObj.append(key, formData[key]);
      }

      if (profileId) {
        await updateProfile(profileId, formDataObj, access);
        showAlert("Success", "Patient profile updated successfully", "success");
      } else {
        await createProfile(formDataObj, access);
        showAlert("Success", "Patient profile created successfully", "success");
      }

      navigate("/patient");
    } catch (error) {
      console.error("Error updating/creating patient profile:", error);
      showAlert(
        "Error",
        error.message ||
          "An error occurred while updating/creating the patient profile. Please try again later.",
        "error"
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="w-100 border shadow-lg p-5">
        <h1 className="text-center mb-4">Complete Your Profile</h1>
        <Form onSubmit={handleSubmit} encType="multipart/form-data" className="row m-0">
          <div className="col-md-6">
            <FormGroup>
              <Label for="full_name">Full Name</Label>
              <Input
                type="text"
                name="full_name"
                id="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup>
              <Label for="date_of_birth">Date of Birth</Label>
              <Input
                type="date"
                name="date_of_birth"
                id="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup>
              <Label for="age">Age</Label>
              <Input
                type="number"
                name="age"
                id="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup>
              <Label for="phone_number">Phone Number</Label>
              <Input
                type="tel"
                name="phone_number"
                id="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup>
              <Label for="gender">Gender</Label>
              <Input
                type="text"
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup>
              <Label for="address">Address</Label>
              <textarea
                type="text"
                name="address"
                id="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup>
              <Label for="profile_pic">Profile Picture</Label>
              <Input
                type="file"
                name="profile_pic"
                id="profile_pic"
                onChange={handleChange}
                accept="image/*"
              />
              {formData.profile_pic &&
                typeof formData.profile_pic === "string" && (
                  <div className="mt-3">
                    <img
                      src={formData.profile_pic}
                      alt="Profile"
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                  </div>
                )}
            </FormGroup>
          </div>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default PatientProfileCreate;
