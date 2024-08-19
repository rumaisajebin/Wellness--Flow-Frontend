import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import Swal from "sweetalert2";
import { isTokenValid } from "../../utils/auth";
import { useSelector } from "react-redux";
import { docProfile, updateDoctorDocs } from "./services/api";
import DoctorLayout from "../../component/DoctorLayout";

const DoctorUpdate = () => {
  const navigate = useNavigate();
  const { access } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    phone_number: "",
    address: "",
    bio: "",
    medical_license_no: "",
    specialization: "",
    graduation_year: "",
    years_of_experience: "",
    workplace_name: "",
    profile_pic: null,
    medical_license_certificate: null,
    identification_document: null,
    certificates_degrees: null,
    curriculum_vitae: null,
    proof_of_work: null,
    specialization_certificates: null,
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
        medical_license_no: profile.medical_license_no || "",
        specialization: profile.specialization || "",
        graduation_year: profile.graduation_year || "",
        years_of_experience: profile.years_of_experience || "",
        workplace_name: profile.workplace_name || "",
        profile_pic: profile.profile_pic || null,
        medical_license_certificate: profile.medical_license_certificate || null,
        identification_document: profile.identification_document || null,
        certificates_degrees: profile.certificates_degrees || null,
        curriculum_vitae: profile.curriculum_vitae || null,
        proof_of_work: profile.proof_of_work || null,
        specialization_certificates: profile.specialization_certificates || null,
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
    const { name, value, files } = e.target;

    // Check if the input name corresponds to one of the file fields
    const fileFields = [
      "profile_pic",
      "medical_license_certificate",
      "identification_document",
      "certificates_degrees",
      "curriculum_vitae",
      "proof_of_work",
      "specialization_certificates",
    ];

    if (fileFields.includes(name) && files && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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
      const formDataObj = new FormData();
      for (const key in formData) {
        formDataObj.append(key, formData[key]);
      }

      const response = await updateDoctorDocs(profileId, formDataObj, access);
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
      {/* <div className="d-flex justify-content-center align-items-center vh-100"> */}
        <div className="w-100 border shadow-lg p-5">
          <h1 className="text-center mb-4">Edit Your Profile</h1>
          <Form onSubmit={handleEditSubmit} encType="multipart/form-data" className="row m-0">
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
            <div className="col-md-6">
              <FormGroup>
                <Label for="medical_license_no">Medical License Number</Label>
                <Input
                  type="text"
                  name="medical_license_no"
                  id="medical_license_no"
                  value={formData.medical_license_no}
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label for="specialization">Specialization</Label>
                <Input
                  type="text"
                  name="specialization"
                  id="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label for="graduation_year">Graduation Year</Label>
                <Input
                  type="number"
                  name="graduation_year"
                  id="graduation_year"
                  value={formData.graduation_year}
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label for="years_of_experience">Years of Experience</Label>
                <Input
                  type="number"
                  name="years_of_experience"
                  id="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label for="workplace_name">Workplace Name</Label>
                <Input
                  type="text"
                  name="workplace_name"
                  id="workplace_name"
                  value={formData.workplace_name}
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
            {/* Profile Picture */}
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
                typeof formData.profile_pic === "string" ? (
                  <div className="mt-3">
                    <img
                      src={formData.profile_pic}
                      alt="Profile"
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                  </div>
                ) : null}
              </FormGroup>
            </div>

            {/* Document fields */}
            <div className="col-md-6">
              <FormGroup>
                <Label for="medical_license_certificate">
                  Medical License Certificate
                </Label>
                <Input
                  type="file"
                  name="medical_license_certificate"
                  id="medical_license_certificate"
                  onChange={handleChange}
                />
                {formData.medical_license_certificate &&
                  typeof formData.medical_license_certificate === "string" && (
                    <a
                      href={formData.medical_license_certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View current medical license certificate
                    </a>
                  )}
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label for="identification_document">Identification Document</Label>
                <Input
                  type="file"
                  name="identification_document"
                  id="identification_document"
                  onChange={handleChange}
                />
                {formData.identification_document &&
                  typeof formData.identification_document === "string" && (
                    <a
                      href={formData.identification_document}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View current identification document
                    </a>
                  )}
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label for="certificates_degrees">Certificates & Degrees</Label>
                <Input
                  type="file"
                  name="certificates_degrees"
                  id="certificates_degrees"
                  onChange={handleChange}
                />
                {formData.certificates_degrees &&
                  typeof formData.certificates_degrees === "string" && (
                    <a
                      href={formData.certificates_degrees}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View current certificates & degrees
                    </a>
                  )}
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label for="curriculum_vitae">Curriculum Vitae</Label>
                <Input
                  type="file"
                  name="curriculum_vitae"
                  id="curriculum_vitae"
                  onChange={handleChange}
                />
                {formData.curriculum_vitae &&
                  typeof formData.curriculum_vitae === "string" && (
                    <a
                      href={formData.curriculum_vitae}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View current curriculum vitae
                    </a>
                  )}
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label for="proof_of_work">Proof of Work</Label>
                <Input
                  type="file"
                  name="proof_of_work"
                  id="proof_of_work"
                  onChange={handleChange}
                />
                {formData.proof_of_work &&
                  typeof formData.proof_of_work === "string" && (
                    <a
                      href={formData.proof_of_work}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View current proof of work
                    </a>
                  )}
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label for="specialization_certificates">
                  Specialization Certificates
                </Label>
                <Input
                  type="file"
                  name="specialization_certificates"
                  id="specialization_certificates"
                  onChange={handleChange}
                />
                {formData.specialization_certificates &&
                  typeof formData.specialization_certificates === "string" && (
                    <a
                      href={formData.specialization_certificates}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View current specialization certificates
                    </a>
                  )}
              </FormGroup>
            </div>

            <FormGroup className="text-center mt-4">
              <Button color="primary" type="submit" disabled={loading}>
                Update Profile
              </Button>
            </FormGroup>
          </Form>
        </div>
      {/* </div> */}
    </DoctorLayout>
  );
};

export default DoctorUpdate;
