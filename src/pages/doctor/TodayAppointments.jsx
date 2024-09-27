import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { BASE_URL } from "../../axiosConfig";
import DoctorLayout from "../../component/DoctorLayout";
import { capitalizeFirstLetter } from "../../utils/textUtils";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const TodayAppointments = () => {
  const { access,role } = useSelector((state) => state.auth);
  const [todayBookings, setTodayBookings] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    if (access) {
      try {
        const decodedToken = jwtDecode(access);
        setUserId(decodedToken.user_id); // Set userId in state
        console.log("Decoded userId:", decodedToken.user_id); // Log userId
      } catch (e) {
        setError("Invalid token");
        console.error("Token decoding error:", e);
      }
    } else {
      setError("No access token provided");
    }
  }, [access]);

  // Fetch today's bookings
  const fetchTodayBookings = async () => {
    setLoading(true); // Set loading state to true
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
      setTodayBookings(data);
    } catch (error) {
      console.error("Error fetching today's bookings:", error);
      setError("Failed to fetch today's bookings. Please try again later.");
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  // Fetch confirmed bookings
  const fetchConfirmedBookings = async () => {
    setLoading(true); // Set loading state to true
    try {
      const response = await axios.get(`${BASE_URL}appoinment/bookings/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      // Filter confirmed bookings
      const confirmedBookings = response.data.filter(
        (booking) => booking.status === "confirmed"
      );
      setConfirmedBookings(confirmedBookings);
    } catch (err) {
      setError("Failed to fetch bookings");
      console.error("Fetch bookings error:", err);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  useEffect(() => {
    fetchTodayBookings(); 
    fetchConfirmedBookings(); 
  }, [access]);

  // Fetch token and navigate to VideoCall page
  const handleJoinRoom = async (bookingId) => {
    try {
      const response = await fetch(
        `${BASE_URL}videochat/video-token/generate_token/?booking_id=${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
console.log(bookingId);

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   setError(errorData.detail || "Failed to fetch token");
      //   return;
      // }

      const data = await response.json();
      navigate(`/videocall?room_id=Room-${bookingId}&token=${data.token}`);
    } catch (error) {
      console.error("Error fetching :", error);
      setError("Error fetching token or schedule details");
    }
  };

  
  const initiateChat = (patient_id) => {
    console.log("userId",userId,"patient_id",patient_id);
    
    if (userId && patient_id) {
      
      navigate(
        `/chat?doctorId=${patient_id}&patientId=${userId}`
      );
    } else {
      console.error("User ID or Doctor ID is missing.");
      Swal.fire(
        "Error",
        "Unable to initiate chat due to missing details.",
        "error"
      );
    }
  };


  // Create a column helper
  const columnHelper = createColumnHelper();

  // Define columns for today's bookings table
  const todayColumns = useMemo(
    () => [
      columnHelper.accessor("patient_username", {
        header: "Patient Name",
        cell: (info) => capitalizeFirstLetter(info.getValue()),
      }),
      columnHelper.accessor("booking_time", {
        header: "Booking Time",
        cell: (info) => new Date(info.getValue()).toLocaleString(),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div>
            <button
              className="btn btn-primary me-2"
              onClick={() => handleJoinRoom(row.original.id)}
            >
              Join Video Call
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => initiateChat(row.original.patient_id)}
            >
              Chat with Patient
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  // Create the table instance for today's bookings using useReactTable
  const todayTable = useReactTable({
    data: todayBookings,
    columns: todayColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DoctorLayout>
      <div className="container-fluid py-4">
        <h2 className="my-4 text-center">Today's Appointments</h2>
        {loading ? ( // Show loading state
          <p className="text-center">Loading bookings...</p>
        ) : todayBookings.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
              <thead className="thead-dark">
                {todayTable.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="text-center">
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              onClick: header.column.getToggleSortingHandler(),
                              style: { cursor: "pointer" },
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() === "asc"
                              ? " 🔼"
                              : header.column.getIsSorted() === "desc"
                              ? " 🔽"
                              : null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {todayTable.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="text-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No bookings found for today.</p>
        )}
        {error && <p className="text-danger text-center">{error}</p>}

        {/* Section for Confirmed Bookings */}
        <h2 className="my-4 text-center">Confirmed Appointments</h2>
        {loading ? ( // Show loading state
          <p className="text-center">Loading confirmed bookings...</p>
        ) : confirmedBookings.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th className="text-center">Patient Name</th>
                  <th className="text-center">Booking Time</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {confirmedBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="text-center">
                      {capitalizeFirstLetter(booking.patient_username)}
                    </td>
                    <td className="text-center">
                      {new Date(booking.booking_time).toLocaleString()}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-primary me-2"
                        onClick={() => handleJoinRoom(booking.id)}
                      >
                        Join Video Call
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => initiateChat(booking.patient_id)}
                      >
                        Chat with Patient
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center">No confirmed bookings found.</p>
        )}
      </div>
    </DoctorLayout>
  );
};

export default TodayAppointments;
