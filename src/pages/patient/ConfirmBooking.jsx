import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import PatientLayout from "../../component/PatientLayout";
import { jwtDecode } from "jwt-decode";
import { axiosInstance, PAYMENT_URL, stripePromise } from "../../axiosConfig";


const ConfirmBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const types = ["new_consultation", "prescription", "follow_up"];
  const [selectedType, setSelectedType] = useState(types[0]);
  const [expectedConsultingTime, setExpectedConsultingTime] = useState(null);
  const [useWallet, setUseWallet] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

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
        const response = await axiosInstance.get(
          `appoinment/bookings/expected_consulting_time/?doctor=${doctor.user.id}&date=${formattedDate}`,
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

    const fetchWalletBalance = async () => {
      try {
        const userResponse = await axiosInstance.get(
          `patient/patient-profiles/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        setWalletBalance(
          parseFloat(userResponse.data[0].user.wallet_balance) || 0
        );
      } catch (err) {
        console.error("Error fetching wallet balance:", err);
      }
    };

    fetchExpectedConsultingTime();
    fetchWalletBalance();
  }, [doctor, formattedDate, access]);

  const handleConfirm = async () => {
    const formData = {
      patient: patientId,
      doctor: doctor.user.id,
      schedule: slot.id,
      schedule_date: formattedDate,
      consultation_type: selectedType,
      paid: true,
    };
    console.log("Booking data:", formData);
    try {
      // Confirm booking
      const bookingResponse = await axiosInstance.post(
        `appoinment/bookings/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      if (useWallet) {
        // Handle wallet payment
        const paymentResponse = await axios.post(
          PAYMENT_URL,
          {
            booking_id: bookingResponse.data.id,
            payment_method: "wallet",
          },
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        alert("Payment successful using wallet");
        navigate("/patient/booking-list");
      } else {
        // Handle Stripe payment
        const checkoutResponse = await axios.post(
          PAYMENT_URL,
          {
            booking_id: bookingResponse.data.id,
            payment_method: "stripe",
          },
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        const stripe = await stripePromise;
        stripe.redirectToCheckout({
          sessionId: checkoutResponse.data.sessionId,
        });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.non_field_errors?.[0] ||
        "Error initiating payment. Please try again.";
        console.error("Error initiating payment:", err.response.data);

      alert(errorMessage);
    }
  };

  return (
    <PatientLayout>
      <div className="container">
        <h2 className="my-4">Confirm Booking</h2>

        <div className="row">
          <div class="col d-flex flex-column align-items-start border  border">
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

          <div class="col d-flex flex-column align-items-start border  border">
            <h4>Booking Details</h4>
            <p>
              <strong>Selected Slot:</strong> {slot.day} | {slot.start_time} -{" "}
              {slot.end_time}
            </p>
            <p>
              <strong>Selected Date:</strong> {new Date(date).toDateString()}
            </p>
            <p>
              <strong>Expected Consulting Time:</strong>{" "}
              {expectedConsultingTime !== null
                ? expectedConsultingTime
                : "Calculating..."}
            </p>
            <div className="row align-items-center">
              <div className="col-auto">
                <strong>Consultation Type</strong>
              </div>
              <div className="col">
                <select
                  className="form-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {types.map((type, idx) => (
                    <option key={idx} value={type}>
                      {type.replace("_", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <hr />

        <div>
          <label className="btn btn-light btn-outline-dark mb-5 mx-3">
            <input
              type="checkbox"
              checked={useWallet}
              onChange={() => setUseWallet(!useWallet)}
            />
            Pay with Wallet
          </label>

          {useWallet && walletBalance < doctor.fee && (
            <div className="alert alert-danger">
              Insufficient wallet balance.
            </div>
          )}

          <button
            className="btn btn-light btn-outline-dark mb-5"
            onClick={handleConfirm}
            disabled={useWallet && walletBalance < doctor.fee}
          >
            {useWallet ? "Confirm Booking with Wallet" : "Pay with Stripe"}
          </button>
        </div>
      </div>
    </PatientLayout>
  );
};

export default ConfirmBooking;
