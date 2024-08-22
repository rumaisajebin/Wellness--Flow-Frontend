import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Table, Button, FormGroup, Label, Input } from "reactstrap";
import { jwtDecode } from "jwt-decode";
import DoctorLayout from "../../component/DoctorLayout";

const BASE_URL = "http://127.0.0.1:8000/appoinment";

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
          `${BASE_URL}/bookings/?doctor=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setBookings(response.data);
        // Initialize selectedStatus state
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
        `${BASE_URL}/bookings/${bookingId}/update_status/`,
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
      console.error(
        "Error updating booking status:",
        err.response?.data || err
      );
      setError("Error updating booking status");
    }
  };

  return (
    <DoctorLayout>
    <div className="container">
      <h2>Manage Booking Slots</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {bookings.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Consultation Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.patient?.full_name || "N/A"}</td>
                <td>
                  {booking.schedule.day},{booking.schedule_date}
                </td>
                <td>{booking.consultation_type}</td>
                <td>{booking.status}</td>
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
                        {/* <option value="completed">Complete</option> */}
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
        <p>No bookings available.</p>
      )}
    </div>
    </DoctorLayout>
  );
};

export default ConfirmBookingSlots;
