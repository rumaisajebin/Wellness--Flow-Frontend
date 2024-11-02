import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import DoctorLayout from "../../component/DoctorLayout";
import { formatTimeTo12Hour } from "../../utils/textUtils";
import { axiosInstance } from "../../axiosConfig";

const DoctorSchedule = () => {
  const { access } = useSelector((state) => state.auth);
  const userId = jwtDecode(access).user_id;

  const [scheduleData, setScheduleData] = useState({
    day: "",
    start_time: "",
    end_time: "",
    max_patients: 12,
  });

  const [daysOfWeek, setDaysOfWeek] = useState([
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
  const [schedules, setSchedules] = useState([]);
  const [editScheduleId, setEditScheduleId] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axiosInstance.get(
          `appoinment/DoctorSchedule/?doctor=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        const fetchedSchedules = response.data;

        setSchedules(fetchedSchedules);

        const scheduledDays = fetchedSchedules.map((schedule) => schedule.day);

        setDaysOfWeek((prevDays) =>
          prevDays.filter((day) => !scheduledDays.includes(day))
        );
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

    const dataToSend = {
      ...scheduleData,
      doctor: userId,
    };

    try {
      const response = await axiosInstance.post(
        `appoinment/DoctorSchedule/`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Schedule created successfully!");
        setScheduleData({
          day: "",
          start_time: "",
          end_time: "",
          max_patients: 12,
        });
        setError(null);

        // Refetch schedules after creation
        fetchSchedules();
      }
    } catch (err) {
      console.error("Error details:", err.response?.data || err);
      setError(err.response?.data?.detail || "Error creating schedule");
      setSuccessMessage("");
    }
  };

  const handleEdit = (schedule) => {
    setEditScheduleId(schedule.id);
    setScheduleData({
      day: schedule.day,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      max_patients: schedule.max_patients,
    });
  };

  const handleSave = async (id) => {
    const dataToUpdate = {
      day: scheduleData.day,
      start_time: scheduleData.start_time,
      end_time: scheduleData.end_time,
      max_patients: scheduleData.max_patients,
      doctor: userId,
    };

    try {
      const response = await axiosInstance.put(
        `/DoctorSchedule/${id}/`,
        dataToUpdate,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Schedule updated successfully!");
        setEditScheduleId(null);
        setError(null);

        // Refetch schedules after update
        fetchSchedules();
      }
    } catch (err) {
      console.error("Error details:", err.response?.data || err);
      setError(err.response?.data?.detail || "Error updating schedule");
      setSuccessMessage("");
    }
  };

  const handleCancel = () => {
    setEditScheduleId(null);
  };

  

  return (
    <DoctorLayout>
      <div className="container my-4">
        {daysOfWeek.length > 0 ? (
          <>
            <h2>Create Your Weekly Schedule</h2>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="day">Day</label>
                    <select
                      name="day"
                      className="form-control"
                      value={scheduleData.day}
                      onChange={handleChange}
                      required
                      disabled={editScheduleId !== null}
                    >
                      <option value="">Select Day</option>
                      {daysOfWeek.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
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
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
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
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="max_patients">
                      Maximum Patients Per Day
                    </label>
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
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary mt-3"
                disabled={editScheduleId !== null}
              >
                Save Schedule
              </button>
            </form>
          </>
        ) : (
          <div className="alert alert-info">
            All days are already scheduled. You cannot create more slots.
          </div>
        )}

        <div className="container my-4">
          <h3 className="text-decoration-underline">Weekly Schedule Overview</h3>
          {schedules.length > 0 ? (
            <table className="table my-4">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Max Patients</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules
                  .sort((a, b) =>
                    daysOfWeek.indexOf(a.day) > daysOfWeek.indexOf(b.day)
                      ? 1
                      : -1
                  )
                  .map((schedule) => (
                    <tr key={schedule.id}>
                      <td>{schedule.day}</td>
                      <td>
                        {editScheduleId === schedule.id ? (
                          <input
                            type="time"
                            name="start_time"
                            className="form-control"
                            value={scheduleData.start_time}
                            onChange={handleChange}
                          />
                        ) : (
                          formatTimeTo12Hour(schedule.start_time)
                        )}
                      </td>
                      <td>
                        {editScheduleId === schedule.id ? (
                          <input
                            type="time"
                            name="end_time"
                            className="form-control"
                            value={scheduleData.end_time}
                            onChange={handleChange}
                          />
                        ) : (
                          formatTimeTo12Hour(schedule.end_time)
                        )}
                      </td>
                      <td>
                        {editScheduleId === schedule.id ? (
                          <input
                            type="number"
                            name="max_patients"
                            className="form-control"
                            value={scheduleData.max_patients}
                            onChange={handleChange}
                            min="1"
                          />
                        ) : (
                          schedule.max_patients
                        )}
                      </td>
                      <td>
                        {editScheduleId === schedule.id ? (
                          <>
                            <button
                              className="btn btn-success me-2"
                              onClick={() => handleSave(schedule.id)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEdit(schedule)}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="alert alert-info">
              No schedules available yet.
            </div>
          )}

          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorSchedule;
