import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {jwtDecode} from "jwt-decode";  // Correct import
import DoctorLayout from "../../component/DoctorLayout";

const BASE_URL = "http://127.0.0.1:8000/appoinment";

const DoctorSchedule = () => {
  const { access } = useSelector((state) => state.auth);
  const userId = jwtDecode(access).user_id;  // Decode the JWT to get the user ID
  console.log(userId);
  
  
  const [scheduleData, setScheduleData] = useState({
    day: "",
    start_time: "",
    end_time: "",
    max_patients: 12,
  });

  const [daysOfWeek] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]);

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [schedules, setSchedules] = useState([]);  // State for storing fetched schedules

  // Fetch schedules when the component mounts
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/DoctorSchedule/?doctor=${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });
        setSchedules(response.data);  // Set fetched schedules
      } catch (err) {
        console.error("Error fetching schedules:", err.response?.data || err);
        setError("Error fetching schedules");
      }
    };

    fetchSchedules();
  }, [userId, access]);

  const handleChange = (e) => {
    setScheduleData({
      ...scheduleData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the doctor field to the scheduleData
    const dataToSend = {
      ...scheduleData,
      doctor: userId,  // Add doctor ID to the payload
    };

    // Log the data that will be sent in the request
    console.log("Data being sent to the server:", dataToSend);

    try {
      const response = await axios.post(
        `${BASE_URL}/DoctorSchedule/`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      // Log the response data
      console.log("Response from server:", response.data);

      if (response.status === 201) {
        setSuccessMessage("Schedule created successfully!");
        setScheduleData({
          day: "",
          start_time: "",
          end_time: "",
          max_patients: 12,
        });
        setError(null);
        
        // Fetch updated schedules
        const fetchSchedules = async () => {
          try {
            const response = await axios.get(`${BASE_URL}/DoctorSchedule/?doctor=${userId}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access}`,
              },
            });
            setSchedules(response.data);  // Update schedules
          } catch (err) {
            console.error("Error fetching schedules:", err.response?.data || err);
            setError("Error fetching schedules");
          }
        };

        fetchSchedules();
      }
    } catch (err) {
      console.error("Error details:", err.response?.data || err);
      setError(err.response?.data?.detail || "Error creating schedule");
      setSuccessMessage("");
    }
  };

  return (
    <DoctorLayout>
    <div className="container">
      <h2>Create Doctor Schedule</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="day">Day</label>
          <select
            name="day"
            className="form-control"
            value={scheduleData.day}
            onChange={handleChange}
            required
          >
            <option value="">Select Day</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="start_time">Start Time</label>
          <input
            type="time"
            name="start_time"
            className="form-control"
            value={scheduleData.start_time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="end_time">End Time</label>
          <input
            type="time"
            name="end_time"
            className="form-control"
            value={scheduleData.end_time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="max_patients">Max Patients</label>
          <input
            type="number"
            name="max_patients"
            className="form-control"
            value={scheduleData.max_patients}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Schedule
        </button>
      </form>
      <h3>Scheduled Times</h3>
      {schedules.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Max Patients</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>{schedule.day}</td>
                <td>{schedule.start_time}</td>
                <td>{schedule.end_time}</td>
                <td>{schedule.max_patients}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No schedules found.</p>
      )}
    </div>
    </DoctorLayout>
  );
};

export default DoctorSchedule;
