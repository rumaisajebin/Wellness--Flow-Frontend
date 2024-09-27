import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Table, FormGroup, Label, Input } from "reactstrap";
import {jwtDecode} from "jwt-decode";
import DoctorLayout from "../../component/DoctorLayout";
import { capitalizeFirstLetter } from "../../utils/textUtils";
import { BASE_URL } from "../../axiosConfig";

const ConfirmBookingSlots = () => {
  const { access } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});
  const userId = jwtDecode(access).user_id;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}appoinment/bookings/?doctor=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setBookings(response.data);
        const initialStatus = {};
        response.data.forEach((booking) => {
          initialStatus[booking.id] = booking.status;
        });
        setSelectedStatus(initialStatus);
      } catch (err) {
        console.error("Error fetching bookings:", err.response?.data || err);
        setError("Error fetching bookings");
      }
    };

    fetchBookings();
  }, [access, userId]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      if (!bookingId) {
        throw new Error("Booking ID is required.");
      }
      await axios.patch(
        `${BASE_URL}appoinment/bookings/${bookingId}/update_status/`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
      setSelectedStatus((prevStatus) => ({
        ...prevStatus,
        [bookingId]: newStatus,
      }));
    } catch (err) {
      console.error("Error updating booking status:", err.response?.data || err);
      setError("Error updating booking status");
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "long" }; // Get the day of the week
    const dayName = date.toLocaleDateString("en-US", options);
    const formattedDate = date.toLocaleDateString("en-GB"); // Format as dd/mm/yyyy
    return `${dayName}, ${formattedDate}`;
  };

  // Filter bookings to show only upcoming and pending ones
  const filteredBookings = bookings.filter((booking) => {
    const today = new Date();
    const bookingDate = new Date(booking.schedule_date);
    return (
      bookingDate >= today && // Only future bookings
      booking.status !== "completed" &&
      booking.status !== "canceled" // Exclude completed and canceled bookings
    );
  });

  return (
    <DoctorLayout>
      <div className="container py-4">
        <h2 className="text-center mb-4">Manage Booking Slots</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {filteredBookings.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead className="thead-dark">
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Consultation Type</th>
                <th>Payment Status</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{capitalizeFirstLetter(booking.patient_username) || "N/A"}</td>
                  <td>{formatDate(booking.schedule_date)}</td> {/* Format the date here */}
                  <td>{capitalizeFirstLetter(booking.consultation_type)}</td>
                  <td>{booking.paid ? "Paid" : "Not Paid"}</td>
                  <td>{capitalizeFirstLetter(booking.status)}</td>
                  <td>
                    {booking.status === "pending" && (
                      <FormGroup>
                        <Label for={`status-${booking.id}`}>Status</Label>
                        <Input
                          type="select"
                          id={`status-${booking.id}`}
                          value={selectedStatus[booking.id] || "pending"}
                          onChange={(e) =>
                            handleStatusChange(booking.id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirm</option>
                          <option value="canceled">Cancel</option>
                        </Input>
                      </FormGroup>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center">No upcoming bookings available.</p>
        )}
      </div>
    </DoctorLayout>
  );
};

export default ConfirmBookingSlots;
