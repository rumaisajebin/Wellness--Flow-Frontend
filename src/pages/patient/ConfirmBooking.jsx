import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import PatientLayout from "../../component/PatientLayout";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://127.0.0.1:8000/appoinment";
const PAYMENT_URL = "http://127.0.0.1:8000/payment/payments/create_checkout_session/";
const stripePromise = loadStripe("pk_test_51PvfpaGFFuSDNKGDBkvHUBNNM8KISveSjN0cjPBFYX7OqoxJWqnw3bORe91cYA6qPF67whAs8lZVZsVHB0DuurAU00VkoKG4zC"); // Replace with your actual Stripe public key

const ConfirmBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const types = ["new_consultation", "prescription", "follow_up"];
  const [selectedType, setSelectedType] = useState(types[0]);
  const [expectedConsultingTime, setExpectedConsultingTime] = useState(null);
  const [checkoutSessionId, setCheckoutSessionId] = useState(null);

  const { access } = useSelector((state) => state.auth);
  const patientId = jwtDecode(access).user_id;

  const { doctor, slot, date } = location.state || {};

  if (!doctor || !slot || !date) {
    return (
      <div className="alert alert-danger">No booking details available.</div>
    );
  }

  const formattedDate =
    date instanceof Date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`
      : date;

  useEffect(() => {
    const fetchExpectedConsultingTime = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/bookings/expected_consulting_time/?doctor=${doctor.user.id}&date=${formattedDate}`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setExpectedConsultingTime(response.data.expected_time);
      } catch (err) {
        console.error("Error fetching expected consulting time:", err);
        setExpectedConsultingTime("Unable to calculate expected time");
      }
    };

    fetchExpectedConsultingTime();
  }, [doctor, formattedDate, access]);

  const handleConfirm = async () => {
    const formData = {
      patient: patientId,
      doctor: doctor.user.id,
      schedule: slot.id,
      schedule_date: formattedDate,
      consultation_type: selectedType,
      paid: true, // Ensure this field is included and set to true
    };

    try {
      // Confirm booking
      const bookingResponse = await axios.post(`${BASE_URL}/bookings/`, formData, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      // Create Stripe Checkout Session
      const checkoutResponse = await axios.post(PAYMENT_URL, {
        booking_id: bookingResponse.data.id,
      }, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const stripe = await stripePromise;
      stripe.redirectToCheckout({ sessionId: checkoutResponse.data.sessionId });

    } catch (err) {
      console.error("Error initiating payment:", err);
      alert("Error initiating payment. Please try again.");
    }
  };

  return (
    <PatientLayout>
      <div className="container">
        <h2>Confirm Booking</h2>
        <div>
          <h4>Doctor Profile</h4>
          <p><strong>Name:</strong> {doctor.full_name}</p>
          <p><strong>Specialization:</strong> {doctor.specialization}</p>
          <p><strong>Phone Number:</strong> {doctor.phone_number}</p>
          <p><strong>Address:</strong> {doctor.address}</p>
          <p><strong>Bio:</strong> {doctor.bio}</p>
        </div>

        <hr />

        <div>
          <h4>Booking Details</h4>
          <p><strong>Selected Slot:</strong> {slot.day} | {slot.start_time} - {slot.end_time}</p>
          <p><strong>Selected Date:</strong> {new Date(date).toDateString()}</p>
          <p><strong>Expected Consulting Time:</strong> {expectedConsultingTime !== null ? expectedConsultingTime : "Calculating..."}</p>
        </div>

        <select
          className="form-select w-50"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {types.map((type, idx) => (
            <option key={idx} value={type}>
              {type.replace("_", " ").toUpperCase()}
            </option>
          ))}
        </select>

        <hr />

        <button className="btn btn-primary mb-5" onClick={handleConfirm}>
          Pay with Stripe
        </button>
      </div>
    </PatientLayout>
  );
};

export default ConfirmBooking;
