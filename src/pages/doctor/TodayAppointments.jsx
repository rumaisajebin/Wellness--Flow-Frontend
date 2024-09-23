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

const TodayAppointments = () => {
  const { access } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);
  const navigate = useNavigate();

  // Fetch today's confirmed and paid bookings
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
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings. Please try again later.");
      }
    };

    fetchBookings();
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

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to fetch token");
        return;
      }

      const data = await response.json();
      navigate(`/videocall?room_id=Room-${bookingId}&token=${data.token}`);
    } catch (error) {
      console.error("Error fetching video token:", error);
      setError("Error fetching token or schedule details");
    }
  };

  // Create a column helper
  const columnHelper = createColumnHelper();

  // Define columns for the table
  const columns = useMemo(
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
          <button
            className="btn btn-primary"
            onClick={() => handleJoinRoom(row.original.id)}
          >
            Join Video Call
          </button>
        ),
      }),
    ],
    []
  );

  // Create the table instance using useReactTable
  const table = useReactTable({
    data: bookings,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DoctorLayout>
      <div className="container-fluid py-4">
        <h2 className="my-4 text-center">Today's Appointments</h2>
        {bookings.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
              <thead className="thead-dark">
                {table.getHeaderGroups().map((headerGroup) => (
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
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
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
      </div>
    </DoctorLayout>
  );
};

export default TodayAppointments;
