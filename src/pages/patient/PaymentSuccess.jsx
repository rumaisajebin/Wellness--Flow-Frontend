import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { BASE_URL } from "../../axiosConfig";
import { useSelector } from "react-redux";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { access } = useSelector((state) => state.auth);
  const hasCalledApi = useRef(false); // Create a ref to track API call

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const sessionId = queryParams.get("session_id");
    const bookingId = queryParams.get("booking_id");

    if (sessionId && bookingId && !hasCalledApi.current) { // Check if API was already called
      hasCalledApi.current = true; // Set ref to true to prevent further calls

      axios
        .get(
          `${BASE_URL}payment/payments/payment_success/?session_id=${sessionId}&booking_id=${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        )
        .then((response) => {
          // Handle success response
          console.log("Payment Success:", response.data);

          Swal.fire({
            title: "Payment Successful!",
            text: "You will be redirected to your booking list in 10 seconds...",
            icon: "success",
            timer: 10000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            backdrop: true,
            customClass: {
              popup: "swal2-shadow",
            },
          });

          const timer = setTimeout(() => {
            navigate("/patient/booking-list");
          }, 10000);

          return () => clearTimeout(timer);
        })
        .catch((error) => {
          // Handle error response
          console.error("Payment Error:", error);
          Swal.fire({
            title: "Payment Error!",
            text: "There was an issue processing your payment.",
            icon: "error",
            confirmButtonText: "Try Again",
          });
        });
    }
  }, [access, navigate]);

  return null;
};

export default PaymentSuccess;
