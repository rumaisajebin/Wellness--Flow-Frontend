import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import Swal from "sweetalert2";
import { isTokenValid } from "../../utils/auth";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { docProfile, uploadDoctorDocs } from "./services/api";

const DoctorVerificationForm = () => {
  const navigate = useNavigate();
  const { access } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      full_name: "",
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
    },
    mode: "onBlur",
  });

  const [profileId, setProfileId] = useState(null);

  const fetchProfileId = async () => {
    try {
      const response = await docProfile(access);
      setProfileId(response[0].id);
    } catch (error) {
      console.error("Error fetching profile ID:", error);
      showAlert("Error", "Failed to fetch profile ID.");
    }
  };

  useEffect(() => {
    fetchProfileId();
  }, []);

  const onSubmit = async (data) => {
    if (!isTokenValid(access)) {
      alert("Your session has expired. Please log in again.");
      navigate("/signin");
      return;
    }
    try {
      const formDataObj = new FormData();
      for (const key in data) {
        if (data[key]) {
          formDataObj.append(key, data[key]);
        }
      }

      const response = await uploadDoctorDocs(profileId, formDataObj, access);
      console.log(response);
      showAlert("Success", "Doctor profile updated successfully", "success");
      navigate("/doctor");
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

  const showAlert = (title, text, icon = "info") => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: "OK",
    });
  };

  const validateFile = (file) => {
    if (file && !file.name.match(/\.(pdf)$/)) {
      return "Only PDF files are allowed.";
    }
    return true;
  };

  const validateProfilePic = (file) => {
    if (file && !file.name.match(/\.(jpg|jpeg|png)$/)) {
      return "Only image files (jpg, jpeg, png) are allowed.";
    }
    return true;
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="w-100 border shadow-lg p-5">
        <h1 className="text-center mb-4">Complete Your Profile</h1>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="row m-0"
        >
          <div className="col-md-6">
            <FormGroup>
              <Label for="full_name">Full Name</Label>
              <Input
                type="text"
                name="full_name"
                id="full_name"
                {...register("full_name", {
                  required: "Full name is required",
                })}
                placeholder="Enter your full name"
              />
              {errors.full_name && (
                <p className="text-danger">{errors.full_name.message}</p>
              )}
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup>
              <Label for="phone_number">Phone Number</Label>
              <Input
                type="tel"
                name="phone_number"
                id="phone_number"
                {...register("phone_number", {
                  required: "Phone number is required",
                })}
                placeholder="Enter your phone number"
              />
              {errors.phone_number && (
                <p className="text-danger">{errors.phone_number.message}</p>
              )}
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup>
              <Label for="address">Address</Label>
              <textarea
                name="address"
                id="address"
                className="form-control"
                {...register("address", { required: "Address is required" })}
                placeholder="Enter your address"
              />
              {errors.address && (
                <p className="text-danger">{errors.address.message}</p>
              )}
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup>
              <Label for="bio">Bio</Label>
              <textarea
                placeholder="Describe yourself"
                name="bio"
                id="bio"
                className="form-control"
                {...register("bio", { required: "Bio is required" })}
              />
              {errors.bio && (
                <p className="text-danger">{errors.bio.message}</p>
              )}
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup>
              <Label for="medical_license_no">Medical License Number</Label>
              <Input
                type="text"
                name="medical_license_no"
                id="medical_license_no"
                {...register("medical_license_no", {
                  required: "Medical License Number is required",
                })}
                placeholder="Enter your medical license number"
              />
              {errors.medical_license_no && (
                <p className="text-danger">
                  {errors.medical_license_no.message}
                </p>
              )}
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup>
              <Label for="specialization">Specialization</Label>
              <Input
                type="text"
                name="specialization"
                id="specialization"
                {...register("specialization", {
                  required: "Specialization is required",
                })}
                placeholder="Enter your specialization"
              />
              {errors.specialization && (
                <p className="text-danger">{errors.specialization.message}</p>
              )}
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup>
              <Label for="graduation_year">Graduation Year</Label>
              <Input
                type="number"
                name="graduation_year"
                id="graduation_year"
                {...register("graduation_year", {
                  required: "Graduation Year is required",
                })}
                placeholder="Enter your graduation year"
              />
              {errors.graduation_year && (
                <p className="text-danger">{errors.graduation_year.message}</p>
              )}
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup>
              <Label for="years_of_experience">Years of Experience</Label>
              <Input
                type="number"
                name="years_of_experience"
                id="years_of_experience"
                {...register("years_of_experience", {
                  required: "Years of Experience is required",
                })}
                placeholder="Enter your years of experience"
              />
              {errors.years_of_experience && (
                <p className="text-danger">
                  {errors.years_of_experience.message}
                </p>
              )}
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup>
              <Label for="workplace_name">Workplace Name</Label>
              <Input
                type="text"
                name="workplace_name"
                id="workplace_name"
                {...register("workplace_name", {
                  required: "Workplace Name is required",
                })}
                placeholder="Enter your workplace name"
              />
              {errors.workplace_name && (
                <p className="text-danger">{errors.workplace_name.message}</p>
              )}
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
                {...register("profile_pic", {
                  required: "Profile picture is required",
                  validate: validateProfilePic,
                })}
                onChange={(e) => setValue("profile_pic", e.target.files[0])}
                accept="image/*"
              />
              {errors.profile_pic && (
                <p className="text-danger">{errors.profile_pic.message}</p>
              )}
              {watch("profile_pic") && (
                <div className="mt-3">
                  <img
                    src={URL.createObjectURL(watch("profile_pic"))}
                    alt="Profile"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                </div>
              )}
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
                {...register("medical_license_certificate", {
                  required: "Medical license certificate is required",
                  validate: validateFile,
                })}
                onChange={(e) =>
                  setValue("medical_license_certificate", e.target.files[0])
                }
                accept=".pdf"
              />
              {errors.medical_license_certificate && (
                <p className="text-danger">
                  {errors.medical_license_certificate.message}
                </p>
              )}
              {watch("medical_license_certificate") && (
                <a
                  href={URL.createObjectURL(
                    watch("medical_license_certificate")
                  )}
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
              <Label for="identification_document">
                Identification Document
              </Label>
              <Input
                type="file"
                name="identification_document"
                id="identification_document"
                {...register("identification_document", {
                  required: "Identification document is required",
                  validate: validateFile,
                })}
                onChange={(e) =>
                  setValue("identification_document", e.target.files[0])
                }
                accept=".pdf"
              />
              {errors.identification_document && (
                <p className="text-danger">
                  {errors.identification_document.message}
                </p>
              )}
              {watch("identification_document") && (
                <a
                  href={URL.createObjectURL(watch("identification_document"))}
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
              <Label for="certificates_degrees">Certificates and Degrees</Label>
              <Input
                type="file"
                name="certificates_degrees"
                id="certificates_degrees"
                {...register("certificates_degrees", {
                  required: "Certificates and degrees are required",
                  validate: validateFile,
                })}
                onChange={(e) =>
                  setValue("certificates_degrees", e.target.files[0])
                }
                accept=".pdf"
              />
              {errors.certificates_degrees && (
                <p className="text-danger">
                  {errors.certificates_degrees.message}
                </p>
              )}
              {watch("certificates_degrees") && (
                <a
                  href={URL.createObjectURL(watch("certificates_degrees"))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View current certificates and degrees
                </a>
              )}
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup>
              <Label for="curriculum_vitae">Curriculum Vitae (CV)</Label>
              <Input
                type="file"
                name="curriculum_vitae"
                id="curriculum_vitae"
                {...register("curriculum_vitae", {
                  required: "Curriculum Vitae (CV) is required",
                  validate: validateFile,
                })}
                onChange={(e) =>
                  setValue("curriculum_vitae", e.target.files[0])
                }
                accept=".pdf"
              />
              {errors.curriculum_vitae && (
                <p className="text-danger">{errors.curriculum_vitae.message}</p>
              )}
              {watch("curriculum_vitae") && (
                <a
                  href={URL.createObjectURL(watch("curriculum_vitae"))}
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
                {...register("proof_of_work", {
                  required: "Proof of work is required",
                  validate: validateFile,
                })}
                onChange={(e) => setValue("proof_of_work", e.target.files[0])}
                accept=".pdf"
              />
              {errors.proof_of_work && (
                <p className="text-danger">{errors.proof_of_work.message}</p>
              )}
              {watch("proof_of_work") && (
                <a
                  href={URL.createObjectURL(watch("proof_of_work"))}
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
                {...register("specialization_certificates", {
                  required: "Specialization certificates are required",
                  validate: validateFile,
                })}
                onChange={(e) =>
                  setValue("specialization_certificates", e.target.files[0])
                }
                accept=".pdf"
              />
              {errors.specialization_certificates && (
                <p className="text-danger">
                  {errors.specialization_certificates.message}
                </p>
              )}
              {watch("specialization_certificates") && (
                <a
                  href={URL.createObjectURL(
                    watch("specialization_certificates")
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View current specialization certificates
                </a>
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

export default DoctorVerificationForm;
