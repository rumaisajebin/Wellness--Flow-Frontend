// ConfirmBooking.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import PatientLayout from "../../component/PatientLayout";

const ConfirmBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const types = ["new_consultation", "prescription", "follow_up"];
  const [selectedType, setSelectedType] = useState(types[0]);

  const { access } = useSelector((state) => state.auth);

  const patientId = jwtDecode(access).user_id;

  const { doctor, slot, date } = location.state || {};

  if (!doctor || !slot || !date) {
    return (
      <div className="alert alert-danger">No booking details available.</div>
    );
  }

  const consultingTime = slot ? slot.end_time : "N/A";

  const handleConfirm = async () => {
    // Ensure the date is in YYYY-MM-DD format
    const formattedDate =
      date instanceof Date
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(date.getDate()).padStart(2, "0")}`
        : date;

    const formData = {
      patient: patientId,
      doctor: doctor.user.id,
      schedule: slot.id,
      schedule_date: formattedDate, // Ensure the date is formatted correctly
      consultation_type: selectedType,
    };

    console.log(formData);

    try {
      await axios.post("http://127.0.0.1:8000/appoinment/bookings/", formData, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      navigate("/booking-success");
    } catch (err) {
      console.error("Error confirming booking:", err);
      alert("Error confirming booking. Please try again.");
    }
  };

  return (
    <PatientLayout>
      <div className="container">
        <h2>Confirm Booking</h2>
        <div>
          <h4>Doctor Profile</h4>
          <p>
            <strong>Name:</strong> {doctor.full_name}
          </p>
          <p>
            <strong>Specialization:</strong> {doctor.specialization}
          </p>
          <p>
            <strong>Phone Number:</strong> {doctor.phone_number}
          </p>
          <p>
            <strong>Address:</strong> {doctor.address}
          </p>
          <p>
            <strong>Bio:</strong> {doctor.bio}
          </p>
        </div>

        <hr />

        <div>
          <h4>Booking Details</h4>
          <p>
            <strong>Selected Slot:</strong> {slot.day} | {slot.start_time} -{" "}
            {slot.end_time}
          </p>
          <p>
            <strong>Selected Date:</strong> {date.toDateString()}
          </p>
          <p>
            <strong>Expected Consulting Time:</strong> {consultingTime}
          </p>
        </div>

        <select
          className="form-select w-50"
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {types.map((type, idx) => (
            <option key={idx + 1} value={type}>
              {type}
            </option>
          ))}
        </select>

        <hr />

        <button className="btn btn-primary mb-5" onClick={handleConfirm}>
          Confirm Booking
        </button>
      </div>
    </PatientLayout>
  );
};

export default ConfirmBooking;
