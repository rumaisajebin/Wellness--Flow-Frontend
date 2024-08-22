import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import PatientLayout from "../../component/PatientLayout";
import { Table } from "reactstrap"; // Importing the Table component from reactstrap

const BookingList = () => {
  const { access } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [access]);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>{error}</p>;

  return (
    <PatientLayout>
      <div className="container">
      <h2 className="my-4">Your Bookings</h2>
        
        {bookings.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Consultation Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={`${booking.id}-${booking.schedule_date}`}>
                  <td>{index + 1}</td>
                  <td>{booking.doctor.full_name}</td>
                  <td>{booking.schedule.day},{booking.schedule_date}</td>
                  <td>{booking.consultation_type}</td>
                  <td>{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </PatientLayout>
  );
};

export default BookingList;
