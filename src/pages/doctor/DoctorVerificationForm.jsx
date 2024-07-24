import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import Swal from "sweetalert2";
import { isTokenValid } from "../../utils/auth";
import { BASE_URL } from "../../axiosConfig"; // Ensure this path is correct
import { useSelector } from "react-redux";

const DoctorVerificationForm = () => {
  const navigate = useNavigate();
  const { access } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    address:"",
    bio:"",
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

  useEffect(() => {
    const fetchProfileId = async () => {
      try {
        const response = await axios.get(`${BASE_URL}doctor/doctor-profiles/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        setProfileId(response.data[0].id);
      } catch (error) {
        console.error("Error fetching profile ID:", error);
        showAlert("Error", "Failed to fetch profile ID.");
      }
    };

    fetchProfileId();
  }, [BASE_URL, access]);

  useEffect(() => {
    console.log(profileId);
    if (profileId !== null) {
      const fetchDoctorData = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}doctor/doctor-profiles/${profileId}/`,
            {
              headers: {
                Authorization: `Bearer ${access}`,
              },
            }
          );
          console.log(response, "DATAS");
          setFormData({
            full_name: response.data.full_name,
            phone_number: response.data.phone_number || "",
            address:response.data.address || "",
            bio:response.data.bio || "",
            medical_license_no: response.data.medical_license_no || "",
            specialization: response.data.specialization || "",
            graduation_year: response.data.graduation_year || "",
            years_of_experience: response.data.years_of_experience || "",
            workplace_name: response.data.workplace_name || "",
            profile_pic: response.data.profile_pic || null,
            medical_license_certificate:
              response.data.medical_license_certificate || null,
            identification_document:
              response.data.identification_document || null,
            certificates_degrees: response.data.certificates_degrees || null,
            curriculum_vitae: response.data.curriculum_vitae || null,
            proof_of_work: response.data.proof_of_work || null,
            specialization_certificates:
              response.data.specialization_certificates || null,
          });
        } catch (error) {
          console.error("Error fetching doctor data:", error);
          showAlert("Error", "Failed to fetch doctor data.");
        }
      };

      fetchDoctorData();
    }
  }, [profileId]);

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
      "specialization_certificates"
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
      console.log(formDataObj);
      const response = await axios.put(
        `${BASE_URL}doctor/doctor-profiles/${profileId}/`,
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      console.log(response);
      showAlert("Success", "Doctor profile updated successfully", "success");
      navigate("/doctors");
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

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="w-100 border shadow-lg p-5">
        <h1 className="text-center mb-4">Edit Doctor Profile</h1>
        <Form onSubmit={handleEditSubmit} encType="multipart/form-data">
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
          <FormGroup>
            <Label for="address">Address</Label>
            <Input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="bio">Bio</Label>
            <Input
              placeholder="Describe yourself"
              type="text"
              name="bio"
              id="bio"
              value={formData.bio}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="medical_license_no">Medical License Number</Label>
            <Input
              type="text"
              name="medical_license_no"
              id="medical_license_no"
              value={formData.medical_license_no}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="specialization">Specialization</Label>
            <Input
              type="text"
              name="specialization"
              id="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="graduation_year">Graduation Year</Label>
            <Input
              type="number"
              name="graduation_year"
              id="graduation_year"
              value={formData.graduation_year}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="years_of_experience">Years of Experience</Label>
            <Input
              type="number"
              name="years_of_experience"
              id="years_of_experience"
              value={formData.years_of_experience}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="workplace_name">Workplace Name</Label>
            <Input
              type="text"
              name="workplace_name"
              id="workplace_name"
              value={formData.workplace_name}
              onChange={handleChange}
              required
            />
          </FormGroup>

          {/* Profile Picture */}
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

          {/* Document fields */}
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

          <FormGroup>
            <Label for="certificates_degrees">Certificates and Degrees</Label>
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
                  View current certificates and degrees
                </a>
              )}
          </FormGroup>

          <FormGroup>
            <Label for="curriculum_vitae">Curriculum Vitae (CV)</Label>
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

          <Button type="submit" color="primary">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default DoctorVerificationForm;
