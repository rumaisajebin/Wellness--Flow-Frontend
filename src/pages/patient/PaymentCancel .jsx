import React, { useEffect } from "react";
import Swal from "sweetalert2";

const PaymentCancel = () => {
  useEffect(() => {
    Swal.fire({
      title: "Payment Canceled",
      text: "Your payment was canceled. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonColor: "#d33",
    });
  }, []);

  return null;
};

export default PaymentCancel;
