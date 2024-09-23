import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import Swal from "sweetalert2";
import { isTokenValid } from "../../utils/auth";
import { useSelector } from "react-redux";
import { docProfile, updateDoctorDocs } from "./services/api";
import DoctorLayout from "../../component/DoctorLayout";
import { useForm, Controller } from "react-hook-form";

const DoctorUpdate = () => {
  const navigate = useNavigate();
  const { access } = useSelector((state) => state.auth);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm();
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = async () => {
    try {
      const response = await docProfile(access);
      const profile = response[0];
      setProfileId(profile.id);
      Object.keys(profile).forEach((key) => setValue(key, profile[key] || ''));
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

  const showAlert = (title, text, icon = "info") => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: "OK",
    });
  };

  const handleEditSubmit = async (data) => {
    if (!isTokenValid(access)) {
      alert("Your session has expired. Please log in again.");
      navigate("/signin");
      return;
    }
    try {
      const formDataObj = new FormData();
      for (const key in data) {
        formDataObj.append(key, data[key]);
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
      <div className="w-100 border shadow-lg p-5">
        <h1 className="text-center mb-4">Edit Your Profile</h1>
        {error && <Alert color="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit(handleEditSubmit)} encType="multipart/form-data" className="row m-0">
          {[
            { name: "full_name", type: "text", placeholder: "Enter your Full Name" },
            { name: "phone_number", type: "tel", placeholder: "Enter your phone number" },
            { name: "address", type: "textarea", placeholder: "Enter your address" },
            { name: "bio", type: "textarea", placeholder: "Describe yourself" },
            { name: "fee", type: "text", placeholder: "Enter your fee" },
            { name: "medical_license_no", type: "text", placeholder: "Enter your medical license number" },
            { name: "specialization", type: "text", placeholder: "Enter your specialization" },
            { name: "graduation_year", type: "number", placeholder: "Enter your graduation year" },
            { name: "years_of_experience", type: "number", placeholder: "Enter years of experience" },
            { name: "workplace_name", type: "text", placeholder: "Enter workplace name" },
          ].map(({ name, type, placeholder }) => (
            <div className="col-md-6" key={name}>
              <FormGroup>
                <Label for={name}>{placeholder}</Label>
                <Controller
                  name={name}
                  control={control}
                  render={({ field }) => (
                    <Input
                      type={type}
                      id={name}
                      placeholder={placeholder}
                      {...field}
                    />
                  )}
                  rules={{ required: `Please provide your ${name.replace('_', ' ')}.` }}
                />
                {errors[name] && <div className="text-danger">{errors[name].message}</div>}
              </FormGroup>
            </div>
          ))}

          {/* Profile Picture */}
          <div className="col-md-6">
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
                    {field.value && typeof field.value === "string" ? (
                      <div className="mt-3">
                        <img
                          src={field.value}
                          alt="Profile"
                          style={{ maxWidth: "200px", maxHeight: "200px" }}
                        />
                      </div>
                    ) : null}
                  </>
                )}
              />
            </FormGroup>
          </div>

          {/* Document fields */}
          {[
            { name: "medical_license_certificate", placeholder: "Medical License Certificate (PDF)" },
            { name: "identification_document", placeholder: "Identification Document (PDF)" },
            { name: "certificates_degrees", placeholder: "Certificates & Degrees (PDF)" },
            { name: "curriculum_vitae", placeholder: "Curriculum Vitae (PDF)" },
            { name: "proof_of_work", placeholder: "Proof of Work (PDF)" },
            { name: "specialization_certificates", placeholder: "Specialization Certificates (PDF)" },
          ].map(({ name, placeholder }) => (
            <div className="col-md-6" key={name}>
              <FormGroup>
                <Label for={name}>{placeholder}</Label>
                <Controller
                  name={name}
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        type="file"
                        id={name}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          field.onChange(file);
                        }}
                        accept=".pdf"
                      />
                      {field.value && typeof field.value === "string" && (
                        <a
                          href={field.value}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View current {placeholder}
                        </a>
                      )}
                    </>
                  )}
                />
              </FormGroup>
            </div>
          ))}

          <FormGroup className="text-center mt-4">
            <Button color="primary" type="submit" disabled={loading}>
              Update Profile
            </Button>
          </FormGroup>
        </Form>
      </div>
    </DoctorLayout>
  );
};

export default DoctorUpdate;
