import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../axiosConfig";
import { connect } from "twilio-video";

const TodayAppointments = () => {
  const { access } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [room, setRoom] = useState(null);
  const [token, setToken] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}appoinment/bookings/todays_confirmed_paid_bookings/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Sort bookings by start time
        data.sort(
          (a, b) => new Date(a.booking_time) - new Date(b.booking_time)
        );

        setBookings(data);
      } catch (error) {
        console.error("Error fetching today's bookings", error);
        setError("Failed to fetch bookings. Please try again later.");
      }
    };

    fetchBookings();
  }, [access]);

  useEffect(() => {
    const fetchTokenAndSchedule = async () => {
      if (selectedBookingId) {
        try {
          const response = await fetch(
            `${BASE_URL}videochat/video-token/generate_token/?booking_id=${selectedBookingId}`,
            {
              headers: {
                Authorization: `Bearer ${access}`,
              },
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.detail || "Failed to fetch token");
            return;
          }
          const data = await response.json();
          setToken(data.token);

          // Fetch schedule times for the booking
          const scheduleResponse = await fetch(
            `${BASE_URL}appoinment/bookings/schedule_details/?booking_id=${selectedBookingId}`,
            {
              headers: {
                Authorization: `Bearer ${access}`,
              },
            }
          );
          if (!scheduleResponse.ok) {
            throw new Error("Failed to fetch schedule details");
          }
          console.log("selectedBookingId", selectedBookingId);

          const scheduleData = await scheduleResponse.json();
          setStartTime(new Date(scheduleData.start_time));
          setEndTime(new Date(scheduleData.end_time));
        } catch (error) {
          console.error("Error fetching token or schedule details", error);
          setError("Error fetching token or schedule details");
        }
      }
    };

    fetchTokenAndSchedule();
  }, [access, selectedBookingId]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update current time every minute

    return () => clearInterval(intervalId);
  }, []);

  const handleJoinRoom = async () => {
    if (token && startTime && endTime) {
      try {
        // Check if the current time is within the allowed time range for the call
        const now = new Date();
        if (now < startTime || now > endTime) {
          setError("Current time is not within the allowed video call time range.");
          return;
        }

        const room = await connect(token, {
          name: `Room-${selectedBookingId}`,
          audio: true,
          video: true,
        });
        setRoom(room);

        const localTrack = Array.from(
          room.localParticipant.videoTracks.values()
        )[0].track;
        localVideoRef.current.appendChild(localTrack.attach());

        room.on("participantConnected", (participant) => {
          participant.on("trackSubscribed", (track) => {
            remoteVideoRef.current.appendChild(track.attach());
          });
        });
      } catch (error) {
        console.error("Error joining room", error);
        setError("Error joining room");
      }
    } else {
      setError("Token or schedule times are missing.");
    }
  };

  const handleLeaveRoom = () => {
    if (room) {
      room.disconnect();
      setRoom(null);
      setSelectedBookingId(null); // Clear the booking ID
    }
  };

  return (
    <div>
      {!selectedBookingId ? (
        <div>
          <h2>Today's Confirmed and Paid Bookings</h2>

          {/* Display error message if any */}
          {error && <p>{error}</p>}

          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Schedule</th>
                <th>Start Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.patient?.username || "N/A"}</td>
                    <td>{booking.schedule?.day || "N/A"}</td>
                    <td>{booking.booking_time || "N/A"}</td>
                    <td>
                      <button
                        onClick={() => setSelectedBookingId(booking.id)}
                      >
                        Video Call
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No bookings available for today.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <h2>Twilio Video Chat</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div>
            <button onClick={handleJoinRoom} disabled={room || !token}>
              Join Room
            </button>
            <button onClick={handleLeaveRoom} disabled={!room}>
              Leave Room
            </button>
          </div>
          <div>
            <h3>Local Video</h3>
            <div ref={localVideoRef}></div>
          </div>
          <div>
            <h3>Remote Video</h3>
            <div ref={remoteVideoRef}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayAppointments;
