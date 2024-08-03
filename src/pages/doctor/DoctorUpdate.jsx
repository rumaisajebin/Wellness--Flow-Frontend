import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import Swal from "sweetalert2";
import { isTokenValid } from "../../utils/auth";
import { useSelector } from "react-redux";
import { docProfile, updateDoctorDocs, uploadDoctorDocs } from "./services/api";
import DoctorLayout from "../../component/DoctorLayout";

const DoctorUpdate = () => {
  const navigate = useNavigate();
  const { access } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    phone_number: "",
    address: "",
    bio: "",
  });

  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = async () => {
    try {
      const response = await docProfile(access);
      const profile = response[0];
      setProfileId(profile.id);
      setFormData({
        phone_number: profile.phone_number || "",
        address: profile.address || "",
        bio: profile.bio || "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setError("Failed to fetch profile data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!isTokenValid(access)) {
      alert("Your session has expired. Please log in again.");
      navigate("/signin");
      return;
    }
    try {
      const response = await updateDoctorDocs(profileId, formData, access);
      console.log(response);
      showAlert("Success", "Doctor profile updated successfully", "success");
      navigate("/doctor/profile");
    } catch (error) {
      console.error("Error updating doctor:", error);
      showAlert(
        "Error",
        error.message ||
          "An error occurred while updating the doctor profile. Please try again later.",
        "error"
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <DoctorLayout>
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="w-100 border shadow-lg p-5">
        <h1 className="text-center mb-4">Edit Your Profile</h1>
        <Form onSubmit={handleEditSubmit} className="row m-0">
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
          <div className="col-md-12">
            <FormGroup>
              <Label for="bio">Bio</Label>
              <textarea
                placeholder="Describe yourself"
                type="text"
                name="bio"
                id="bio"
                className="form-control"
                value={formData.bio}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </div>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </Form>
      </div>
    </div>
    </DoctorLayout>
  );
};

export default DoctorUpdate;
