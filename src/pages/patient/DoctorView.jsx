import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import PatientLayout from "../../component/PatientLayout";
import { jwtDecode } from "jwt-decode";
import "./css/DoctorView.css";

const BASE_URL = "http://127.0.0.1:8000/patient";

const DoctorView = () => {
  const { access } = useSelector((state) => state.auth);
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = access ? jwtDecode(access).user_id : null;

  useEffect(() => {
    if (!userId) {
      Swal.fire({
        title: "Access Denied",
        text: "Only patients can book appointments.",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/");
      });
    }
  }, [userId, navigate]);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/doctor-profiles/${doctorId}/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setDoctor(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Error fetching doctor details");
      }
    };

    const fetchAvailableSlots = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/doctor-profiles/${doctorId}/slots/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setSlots(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail || "Error fetching available slots"
        );
      }
    };

    const fetchUserBookings = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/appoinment/bookings/?user_id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        console.log(response.data);
        setBookings(response.data);
      } catch (err) {
        setError("Failed to fetch user bookings");
      } finally {
        setLoading(false);
      }
    };

    if (access && doctorId) {
      fetchDoctorDetails();
      fetchAvailableSlots();
      fetchUserBookings();
    }
  }, [doctorId, access]);

  const handleDateChange = (date) => {
    setSelectedDate(date);

    if (date) {
      const selectedDay = date.toLocaleString("en-US", { weekday: "long" });

      // Find the matching slot based on the selected day
      const matchingSlot = slots.find(
        (slot) => slot.day.toLowerCase() === selectedDay.toLowerCase()
      );

      // Update the selected slot state
      setSelectedSlot(matchingSlot);

      // Check if there's a booking on this date
      const isBooked = bookings.some(
        (booking) =>
          new Date(booking.schedule_date).toDateString() === date.toDateString()
      );

      // If a slot is found, and if there are bookings, you might want to show that in the UI
      if (matchingSlot) {
        // Example logic to handle bookings on the selected date
        if (isBooked) {
          // Handle booking status (e.g., show a warning or alert)
        } else {
          // Handle available slot status
        }
      } else {
        // Handle case when no slot is available for the selected day
        setError("No available slot for the selected day.");
      }
    } else {
      setError("Please select a valid date.");
    }
  };

  const getDayClassName = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return "past-unavailable-slot"; // Mark all past dates as unavailable
    }

    const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
    const matchingSlot = slots.find(
      (slot) => slot.day.toLowerCase() === dayOfWeek.toLowerCase()
    );

    const userBookedSlot = bookings.find((booking) => {
      const bookingDate = new Date(booking.schedule_date).toDateString();
      return (
        booking.user_id === userId &&
        booking.schedule === matchingSlot?.id &&
        bookingDate === date.toDateString()
      );
    });

    if (!matchingSlot) {
      return "unavailable-slot"; // No slot available for the selected day
    } else if (userBookedSlot) {
      return "user-booked-slot"; // Slot booked by the current user
    }

    return "available-slot"; // Slot is available
  };

  const checkDate = async () => {
    try {
      console.log("reached here");
      console.log(selectedDate, selectedSlot, doctor);

      if (selectedDate) {
        navigate("/patient/confirm-booking", {
          state: {
            doctor,
            date: selectedDate,
            slot: selectedSlot,
          },
        });
      } else {
        setError("Please select a valid slot and date.");
      }
    } catch (error) {
      console.error("Error during checkDate execution:", error);
      setError("An error occurred while checking the date. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <PatientLayout>
      <div className="container">
        <h2 className="my-4">{doctor.full_name}</h2>
        <div className="row">
          <div className="col-md-4">
            <img
              src={doctor.profile_pic}
              alt={doctor.full_name}
              className="img-thumbnail"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <div className="col-md-8">
            <h5>Specialization: {doctor.specialization}</h5>
            <p>
              <strong>Phone Number:</strong> {doctor.phone_number}
            </p>
            <p>
              <strong>Address:</strong> {doctor.address}
            </p>
            <p>
              <strong>Bio:</strong> {doctor.bio}
            </p>
            <p>
              <strong>Medical License No:</strong> {doctor.medical_license_no}
            </p>
            <p>
              <strong>Graduation Year:</strong> {doctor.graduation_year}
            </p>
            <p>
              <strong>Years of Experience:</strong> {doctor.years_of_experience}
            </p>
            <p>
              <strong>Workplace:</strong> {doctor.workplace_name}
            </p>
          </div>
        </div>

        <hr />

        <h4>Consultation Time</h4>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Day</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Available Slot</th>
            </tr>
          </thead>
          <tbody>
            {slots.length > 0 ? (
              slots.map((slot, index) => (
                <tr key={index}>
                  <td>{slot.day}</td>
                  <td>{slot.start_time}</td>
                  <td>{slot.end_time}</td>
                  <td>{slot.max_patients}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No available slots</td>
              </tr>
            )}
          </tbody>
        </table>

        <hr />

        <div className="mb-5">
          <h4>Select Date</h4>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
            className="form-control"
            dayClassName={(date) => getDayClassName(date)}
            renderDayContents={(day, date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (date < today) {
                return <div title="Past Date (Unavailable)">{day}</div>;
              }

              const dayOfWeek = date.toLocaleString("en-US", {
                weekday: "long",
              });
              const matchingSlot = slots.find(
                (slot) => slot.day.toLowerCase() === dayOfWeek.toLowerCase()
              );

              const userBookedSlot = bookings.find((booking) => {
                const bookingDate = new Date(
                  booking.schedule_date
                ).toDateString();
                return (
                  booking.user_id === userId &&
                  booking.schedule === matchingSlot?.id &&
                  bookingDate === date.toDateString()
                );
              });

              let status = "Available";
              if (userBookedSlot) {
                status = "Booked by You";
              } else if (!matchingSlot) {
                status = "Unavailable";
              }

              return <div title={status}>{day}</div>;
            }}
          />

          <button className="btn btn-primary ms-3" onClick={checkDate}>
            Check availability
          </button>
        </div>
      </div>
    </PatientLayout>
  );
};

export default DoctorView;
