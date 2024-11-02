import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PatientLayout from "../../component/PatientLayout";
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from "reactstrap";
import Swal from "sweetalert2";
import { axiosInstance } from "../../axiosConfig";
import LoadingAnimation from "../../component/LoadingAnimation";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

const capitalizeWords = (str) => {
  if (!str) return "";
  return String(str).replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const BookingList = () => {
  const { access } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expectedTimes, setExpectedTimes] = useState({});
  const [userId, setUserId] = useState(null);
  const [reasonModal, setReasonModal] = useState(false); // Modal for reason input
  const [cancelReason, setCancelReason] = useState(""); // State to store cancel reason
  const [cancelBookingId, setCancelBookingId] = useState(null); // Track which booking is being canceled
  const navigate = useNavigate();

  // Decode the JWT token to get the user ID
  useEffect(() => {
    if (access) {
      try {
        const decodedToken = jwtDecode(access);
        setUserId(decodedToken.user_id);
        console.log("Decoded userId:", decodedToken.user_id);
      } catch (e) {
        setError("Invalid token");
        console.error("Token decoding error:", e);
      }
    } else {
      setError("No access token provided");
    }
  }, [access]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get(`appoinment/bookings/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        setBookings(response.data);
      } catch (err) {
        setError("Failed to fetch bookings");
        console.error("Fetch bookings error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (access) {
      fetchBookings();
    }
  }, [access]);

  useEffect(() => {
    const fetchExpectedTimes = async () => {
      const times = {};

      for (const booking of bookings) {
        if (
          new Date(booking.schedule_date) >= new Date() &&
          booking.status !== "completed" &&
          booking.status !== "canceled"
        ) {
          try {
            const response = await axiosInstance.get(
              `appoinment/bookings/expected_consulting_time/?doctor=${booking.doctor}&date=${booking.schedule_date}`,
              {
                headers: {
                  Authorization: `Bearer ${access}`,
                },
              }
            );
            times[booking.id] = response.data.expected_time;
          } catch (err) {
            times[booking.id] = "Unable to calculate";
          }
        }
      }

      setExpectedTimes(times);
    };

    if (bookings.length > 0) {
      fetchExpectedTimes();
    }
  }, [bookings, access]);

  const toggleReasonModal = (bookingId) => {
    setCancelBookingId(bookingId);
    setReasonModal(!reasonModal); // Toggle modal visibility
  };

  const submitCancelBooking = async () => {
    try {
      await axiosInstance.post(
        `appoinment/bookings/${cancelBookingId}/cancel_booking/`,
        { status: "canceled", cancel_reason: cancelReason }, // Pass the cancel reason
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      Swal.fire("Success", "Your booking has been canceled.", "success");
      setBookings(
        bookings.map((booking) =>
          booking.id === cancelBookingId
            ? { ...booking, status: "canceled" }
            : booking
        )
      );
    } catch (err) {
      console.log(err);
      Swal.fire(
        "Error",
        "Failed to cancel booking. You can only cancel 24 hours before the consultation time.",
        "error"
      );
    } finally {
      toggleReasonModal(); // Close modal after action
      setCancelReason(""); // Reset reason input
    }
  };

  const initiateChat = (doctorId) => {
    if (userId && doctorId) {
      navigate(`/chat?doctorId=${doctorId}&patientId=${userId}`);
    } else {
      console.error("User ID or Doctor ID is missing.");
      Swal.fire(
        "Error",
        "Unable to initiate chat due to missing details.",
        "error"
      );
    }
  };

  const upcomingBookings = bookings.filter(
    (booking) =>
      new Date(booking.schedule_date) >= new Date() &&
      booking.status !== "completed" &&
      booking.status !== "canceled"
  );

  const pastBookings = bookings.filter(
    (booking) =>
      new Date(booking.schedule_date) < new Date() ||
      booking.status === "completed" ||
      booking.status === "canceled"
  );

  if (loading) {
    return (
      <>
        <p>Loading...</p>
        <LoadingAnimation />
      </>
    );
  }
  if (error) return <p>{error}</p>;

  return (
    <PatientLayout>
      <div className="container">
        <h2 className="my-4">Upcoming Bookings</h2>

        {upcomingBookings.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Email</th>
                <th>Date</th>
                <th>Consultation Type</th>
                <th>Expected Consulting Time</th>
                <th>Payment Status</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {upcomingBookings.map((booking, index) => (
                <tr key={`${booking.id}-${booking.schedule_date}`}>
                  <td>{index + 1}</td>
                  <td>{capitalizeWords(booking.doctor_username || "Unknown")}</td>
                  <td>{capitalizeWords(booking.doctor_specialization || "Unknown")}</td>
                  <td>{booking.doctor_email || "Unknown"}</td>
                  <td>{formatDate(booking.schedule_date)}</td>
                  <td>
                    {capitalizeWords(
                      booking.consultation_type.replace(/_/g, " ")
                    )}
                  </td>
                  <td>{expectedTimes[booking.id] || "Calculating..."}</td>
                  <td>{booking.paid ? "Paid" : "Not Paid"}</td>
                  <td>{capitalizeWords(booking.status)}</td>
                  <td>
                    {booking.status === "confirmed" && (
                      <>
                        <Button
                          color="danger"
                          onClick={() => toggleReasonModal(booking.id)}
                          disabled={
                            new Date(booking.schedule_date) - new Date() <
                            24 * 60 * 60 * 1000
                          }
                        >
                          Cancel
                        </Button>
                        <Button
                          color="primary"
                          onClick={() => initiateChat(booking.doctor_id)}
                          className="ml-2"
                        >
                          Chat with Doctor
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No upcoming bookings found.</p>
        )}

        <h2 className="my-4">Past Bookings</h2>

        {pastBookings.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Email</th>
                <th>Date</th>
                <th>Consultation Type</th>
                <th>Status</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {pastBookings.map((booking, index) => (
                <tr key={`${booking.id}-${booking.schedule_date}`}>
                  <td>{index + 1}</td>
                  <td>{capitalizeWords(booking.doctor_username)}</td>
                  <td>{capitalizeWords(booking.doctor_specialization)}</td>
                  <td>{booking.doctor_email}</td>
                  <td>{formatDate(booking.schedule_date)}</td>
                  <td>
                    {capitalizeWords(
                      booking.consultation_type.replace(/_/g, " ")
                    )}
                  </td>
                  <td>{capitalizeWords(booking.status)}</td>
                  <td>{booking.paid ? "Paid" : "Not Paid"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No past bookings found.</p>
        )}

        {/* Cancel Reason Modal */}
        <Modal isOpen={reasonModal} toggle={toggleReasonModal}>
          <ModalHeader toggle={toggleReasonModal}>Cancel Booking</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="cancelReason">Reason for canceling:</Label>
              <Input
                type="textarea"
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for canceling this booking"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={submitCancelBooking}>
              Submit
            </Button>
            <Button color="secondary" onClick={toggleReasonModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </PatientLayout>
  );
};

export default BookingList;
