import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import PatientLayout from "../../component/PatientLayout";
import { Table, Button } from "reactstrap";
import Swal from "sweetalert2";

const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const BookingList = () => {
  const { access } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expectedTimes, setExpectedTimes] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/appoinment/bookings/",
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setBookings(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [access]);

  useEffect(() => {
    const fetchExpectedTimes = async () => {
      const times = {};

      for (const booking of bookings) {
        if (new Date(booking.schedule_date) >= new Date() && booking.status !== "completed" && booking.status !== "canceled") {
          try {
            const response = await axios.get(
              `http://127.0.0.1:8000/appoinment/bookings/expected_consulting_time/?doctor=${booking.doctor}&date=${booking.schedule_date}`,
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

  const cancelBooking = async (bookingId) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/appoinment/bookings/${bookingId}/update_status/`,
        { status: "canceled" },
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      Swal.fire("Success", "Your booking has been canceled.", "success");
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: "canceled" } : booking
      ));
    } catch (err) {
      Swal.fire("Error", "Failed to cancel booking. You can only cancel 24 hours before the consultation time.", "error");
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

  if (loading) return <p>Loading bookings...</p>;
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
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {upcomingBookings.map((booking, index) => (
                <tr key={`${booking.id}-${booking.schedule_date}`}>
                  <td>{index + 1}</td>
                  <td>{capitalizeWords(booking.doctor_username)}</td>
                  <td>{capitalizeWords(booking.doctor_specialization)}</td>
                  <td>{booking.doctor_email}</td>
                  <td>{formatDate(booking.schedule_date)}</td>
                  <td>{capitalizeWords(booking.consultation_type.replace(/_/g, ' '))}</td>
                  <td>{expectedTimes[booking.id] || "Calculating..."}</td>
                  <td>{capitalizeWords(booking.status)}</td>
                  <td>
                    {booking.status === "confirmed" && (
                      <Button
                        color="danger"
                        onClick={() => cancelBooking(booking.id)}
                        disabled={new Date(booking.schedule_date) - new Date() < 24 * 60 * 60 * 1000}
                      >
                        Cancel
                      </Button>
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
                  <td>{capitalizeWords(booking.consultation_type.replace(/_/g, ' '))}</td>
                  <td>{capitalizeWords(booking.status)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No past bookings found.</p>
        )}
      </div>
    </PatientLayout>
  );
};

export default BookingList;
