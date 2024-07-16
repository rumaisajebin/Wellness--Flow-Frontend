import "../auth/css/signup.css";
// src/features/auth/SignUp.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, updateField } from "../auth/services/slice/authSlice";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "patient",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    dispatch(updateField({ name, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(signupUser(formData));
      navigate('/signin')
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="main-bg">
      <div className="container row d-flex align-items-center mx-auto min-vh-100 ">
        <div className="col-md-5 col-sm-12 col-12 card shadow-sm p-5 m-0">
          <h2 className="text-center fst-italic">Register</h2>
          <div className="d-flex justify-content-center mb-3">
            <hr className="w-75" />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                className="form-control"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            <div className="d-flex justify-content-center m-2">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </form>
          <p className="text-center">
            Already have an account?{" "}
            <Link className="text-decoration-none" to={"/signin"}>
              Login now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
