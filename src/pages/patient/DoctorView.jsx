import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import PatientLayout from "../../component/PatientLayout";

const BASE_URL = "http://127.0.0.1:8000/patient";

const DoctorView = () => {
  const { access } = useSelector((state) => state.auth);
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState(null);

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
        console.log(response.data);

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
        console.log(response.data);

        setSlots(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail || "Error fetching available slots"
        );
      }
    };

    if (access && doctorId) {
      fetchDoctorDetails();
      fetchAvailableSlots();
    }
  }, [doctorId, access]);

  const handleDateChange = (date) => {
    setSelectedDate(date);

    const selectedDay = date.toLocaleString("en-US", { weekday: "long" });

    const matchingSlot = slots.find(
      (slot) => slot.day.toLowerCase() === selectedDay.toLowerCase()
    );

    if (!matchingSlot) {
      Swal.fire({
        title: "No consultation on selected day",
        timer: 5000,
        position: "center",
        showConfirmButton: false,
        timerProgressBar: true,
        toast: true,
        icon: "warning",
      });
      setSelectedDate(null);
    }
    // else if (matchingSlot && matchingSlot.max_patients > bookings.count) {
    //   setError("Selected slot is fully booked. Please choose another day.");
    // }
    else {
      setSelectedSlot(matchingSlot);
    }
  };

  const checkDate = () => {
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
  };

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
              {/* <th>Current Bookings</th>
            <th>Select</th> */}
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
