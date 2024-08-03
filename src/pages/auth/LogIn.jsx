// src/features/auth/LogIn.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../auth/services/slice/authSlice";
import FormInput from "../../component/FormInput";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const LogIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(loginUser(formData)).unwrap();
      if (response.role === "patient") {
        navigate("/patient");
      } else if (response.role === "doctor") {
        if (response.profile_complete) {
          navigate("/doctor");
        } else {
          navigate("/doctor/completion");
        }
      } else if (response.role === "") {
        navigate("/admin");
      }
    } catch (error) {
      console.error("Error logging in", error);
      // if (error.detail === "Invalid credentials.") {
      //   alert("Incorrect username or password. Please try again.");
      // } else if (error.detail === "Account is inactive.") {
      //   alert("Your account is inactive. Please contact support.");
      // } else if (
      //   error.detail === "Email is not verified. Please check your email."
      // ) {
      //   alert(
      //     "Your email is not verified. Please check your email for the verification link."
      //   );
      // } else {
      //   alert("Error logging in. Please try again later.");
      // }
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {

  //     const response = await dispatch(loginUser(formData)).unwrap();
  //     if (response.role === "patient") {
  //       navigate("/patient");
  //     } else if(response.role === "doctor") {
  //       if (response.profile_complete) {
  //         navigate('/doctor')
  //       } else {
  //         navigate('/doctor/completion')
  //       }
  //     }
  //     if(response.role === '') {
  //       navigate("/admin")
  //     }
  //   } catch (error) {
  //     console.error("Error logging in", error);
  //     alert("Error logging in");
  //   }
  // };

  return (
    <div className="main-bg">
      <div className="container row d-flex align-items-center mx-auto min-vh-100 ">
        <div className="col-md-5 col-sm-12 col-12 card shadow-sm p-5 m-0">
          <h2 className="text-center fst-italic">Log In</h2>
          <div className="d-flex justify-content-center mb-3">
            <hr className="w-75" />
          </div>
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />

            {loading && <p>Loading...</p>}
            {error && (
              <p className="text-danger">
                {Array.isArray(error.detail)
                  ? error.detail.join(" ")
                  : error.detail || "Login failed. Please try again."}
              </p>
            )}

            <div className="d-flex justify-content-center m-2">
              <button type="submit" className="btn-submit">
                Log In
              </button>
            </div>
          </form>

          <p className="text-center">
            Already have an account?{" "}
            <Link className="text-decoration-none text-primary" to={"/SignUp"}>
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
