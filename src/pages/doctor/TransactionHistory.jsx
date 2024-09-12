import React, { useEffect, useMemo, useState } from "react";
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
import BookingDetailsModal from "./BookingDetailsModal ";
import { capitalizeFirstLetter } from "../../utils/textUtils";
import DoctorLayout from "../../component/DoctorLayout";
import { Button } from "reactstrap"; // Assuming you're using Reactstrap for Button

const DoctorTransactionHistory = () => {
  const { access } = useSelector((state) => state.auth);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}doctor/transactions/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        const transactionsData = response.data;
  
        setTransactions(transactionsData);
  
        const total = transactionsData.reduce(
          (sum, transaction) => sum + parseFloat(transaction.amount),
          0
        );
        setTotalEarnings(total);
  
        const userResponse = await axios.get(
          `${BASE_URL}doctor/doctor-profiles/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

  
        // Convert walletBalance to a number
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
      { accessorKey: "id", header: "ID" },
     
      {
        accessorKey: "patient_name",
        header: "Patient",
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
        header: "Booking View",
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
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  const {
    getHeaderGroups,
    getRowModel,
    getPageCount,
    getState,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setPageSize: tableSetPageSize,
    getCanNextPage,
    getCanPreviousPage,
  } = table;

  const { pageIndex } = getState().pagination;

  const handleGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
    table.setPageIndex(0); // Reset to the first page when filtering
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <DoctorLayout>
      <div id="root" className="container">
        <h2 className="my-3 text-center">Transaction History</h2>
        <div className="mb-2 d-flex justify-content-between">
        <h4>Wallet Balance: ${Number(walletBalance).toFixed(2)}</h4>
          <h4>Total Earnings: ${totalEarnings.toFixed(2)}</h4>
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
            <Button
              onClick={() => previousPage()}
              disabled={!getCanPreviousPage()}
              className="me-2"
            >
              {"<"}
            </Button>
            <Button
              onClick={() => nextPage()}
              disabled={!getCanNextPage()}
              className="me-2"
            >
              {">"}
            </Button>
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
              value={table.getState().pagination.pageSize}
              onChange={(e) => tableSetPageSize(Number(e.target.value))}
              className="form-select"
              style={{ maxWidth: "120px" }} // Optional: adjust width to fit content
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
    </DoctorLayout>
  );
};

export default DoctorTransactionHistory;
