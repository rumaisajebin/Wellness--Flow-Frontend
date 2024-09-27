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
import { BASE_URL } from "../../axiosConfig";
import { formatTimeTo12Hour } from "../../utils/textUtils";

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
          `${BASE_URL}patient/doctor-profiles/${doctorId}/`,
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
          `${BASE_URL}patient/doctor-profiles/${doctorId}/slots/`,
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
          `${BASE_URL}appoinment/bookings/?user_id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

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

      const matchingSlot = slots.find(
        (slot) => slot.day.toLowerCase() === selectedDay.toLowerCase()
      );

      if (matchingSlot) {
        setSelectedSlot(matchingSlot);

        const isBooked = bookings.some((booking) => {
          const bookingDate = new Date(booking.schedule_date).toDateString();

          return (
            bookingDate === date.toDateString() && booking.patient_id === userId
          );
        });

        if (isBooked) {
          Swal.fire({
            title: "Date Already Booked",
            text: "You have already booked an appointment on this date.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      } else {
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
      return "past-unavailable-slot";
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
      return "unavailable-slot";
    } else if (userBookedSlot) {
      return "user-booked-slot";
    }

    return "available-slot";
  };

  const checkDate = async () => {
    try {
      if (!selectedDate) {
        return Swal.fire({
          title: "Invalid Selection",
          text: "Please select a valid slot and date.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      }

      const isDateBooked = bookings.some((booking) => {
        const bookingDate = new Date(booking.schedule_date).toDateString();
        return (
          booking.user_id === userId &&
          bookingDate === selectedDate.toDateString()
        );
      });

      if (isDateBooked) {
        return Swal.fire({
          title: "Date Already Booked",
          text: "You have already booked an appointment on this date.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      }

      navigate("/patient/confirm-booking", {
        state: {
          doctor,
          date: selectedDate,
          slot: selectedSlot,
        },
      });
    } catch (error) {
      console.error("Error during checkDate execution:", error);

      Swal.fire({
        title: "Error",
        text: "An error occurred while checking the date. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
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
                  <td>{formatTimeTo12Hour(slot.start_time)}</td>{" "}
                  <td>{formatTimeTo12Hour(slot.end_time)}</td>{" "}
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
          <DatePicker
            placeholderText="Select Date"
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
