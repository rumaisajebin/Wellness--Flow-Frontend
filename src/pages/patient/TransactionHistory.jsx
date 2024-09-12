import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../axiosConfig";
import { useSelector } from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import PatientLayout from "../../component/PatientLayout";
import BookingDetailsModal from "../doctor/BookingDetailsModal "; // Ensure this import is correct
import { capitalizeFirstLetter } from "../../utils/textUtils";

const TransactionHistory = () => {
  const { access } = useSelector((state) => state.auth);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}patient/transactions/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        console.log(response.data);
        setTransactions(response.data);

        const userResponse = await axios.get(
          `${BASE_URL}patient/patient-profiles/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setWalletBalance(parseFloat(userResponse.data[0].user.wallet_balance) || 0);

      } catch (error) {
        setError("Failed to fetch transaction history");
        Swal.fire("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [access]);

  const handleViewBooking = (transaction) => {
    setSelectedBooking(transaction.booking || {});
    setIsModalOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "doctor_name",
        header: "Doctor",
        cell: ({ getValue }) => capitalizeFirstLetter(getValue()),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ getValue }) => `$${getValue()}`,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => capitalizeFirstLetter(getValue()),
      },
      {
        accessorKey: "timestamp",
        header: "Timestamp",
        cell: ({ getValue }) => new Date(getValue()).toLocaleString(),
      },
      {
        accessorKey: "booking",
        header: "View Booking",
        cell: ({ row }) => (
          <button
            onClick={() => handleViewBooking(row.original)}
            className="btn btn-info"
          >
            View
          </button>
        ),
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (!globalFilter) return transactions;

    return transactions.filter((transaction) =>
      Object.values(transaction)
        .join(" ")
        .toLowerCase()
        .includes(globalFilter.toLowerCase())
    );
  }, [globalFilter, transactions]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: rowsPerPage } },
  });

  const {
    getHeaderGroups,
    getRowModel,
    getPageCount,
    getState,
    nextPage,
    previousPage,
    setPageSize: tableSetPageSize,
    getCanNextPage,
    getCanPreviousPage,
  } = table;

  const { pageIndex } = getState().pagination;

  const handleGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
    table.setPageIndex(0); // Reset to the first page when filtering
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setRowsPerPage(newSize);
    tableSetPageSize(newSize);
    table.setPageIndex(0); // Reset to first page
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <PatientLayout>
      <div className="container">
        <div className="mb-2 d-flex justify-content-between">
        <h3 className="my-4 text-center">Transaction History</h3>
          <h3 className="my-4 text-center">Wallet Balance: ${walletBalance.toFixed(2)}</h3>
          </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search transactions"
            value={globalFilter}
            onChange={handleGlobalFilterChange}
            className="form-control"
          />
        </div>

        <table className="table table-striped">
          <thead>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination d-flex justify-content-between align-items-center my-3">
          <div className="d-flex align-items-center">
            <button
              onClick={() => previousPage()}
              disabled={!getCanPreviousPage()}
              className="btn btn-primary me-2"
            >
              {"<"}
            </button>
            <button
              onClick={() => nextPage()}
              disabled={!getCanNextPage()}
              className="btn btn-primary me-2"
            >
              {">"}
            </button>
          </div>
          <div className="d-flex align-items-center">
            <div
              className="me-2"
              style={{ whiteSpace: "nowrap", width: "fit-content" }}
            >
              <span>
                Page{" "}
                <strong>
                  {pageIndex + 1} of {getPageCount()}
                </strong>
              </span>
            </div>
            <select
              value={rowsPerPage}
              onChange={handlePageSizeChange}
              className="form-select"
              style={{ maxWidth: "120px" }}
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <BookingDetailsModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          booking={selectedBooking}
        />
      </div>
    </PatientLayout>
  );
};

export default TransactionHistory;
