import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchAllDoctors } from "./api/Api";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import Swal from "sweetalert2";
import AdminLayout from "../../component/AdminLayout";
import PaginationComponent from "../../component/PaginationComponent";
import { Table } from "reactstrap";
import { capitalizeFirstLetter } from "../../utils/textUtils";

const ListDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { access } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const getDoctors = async () => {
      try {
        const response = await fetchAllDoctors(access);
        setDoctors(response);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch doctor profiles.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    getDoctors();
  }, [access]);

  // Define columns
  const columns = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
      },
      {
        header: "Name",
        accessorKey: "user.username",
        cell: (info) => capitalizeFirstLetter(info.getValue()),
      },
      {
        header: "Phone Number",
        accessorKey: "phone_number",
        cell: (info) => info.getValue() || "-",
      },
      {
        header: "Specialization",
        accessorKey: "specialization",
        cell: (info) => capitalizeFirstLetter(info.getValue()),
      },
      {
        header: "Workplace Name",
        accessorKey: "workplace_name",
        cell: (info) => capitalizeFirstLetter(info.getValue()),
      },
      {
        header: "Status",
        accessorKey: "is_profile_verify",
        cell: (info) => (info.getValue() ? "Verified" : "Not Verified"),
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => (
          <button
            onClick={() => handleViewDetails(row.original.id)}
            className="btn btn-primary"
          >
            View
          </button>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => doctors, [doctors]);

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const updated =
        typeof updater === "function"
          ? updater(table.getState().pagination)
          : updater;
      setPageIndex(updated.pageIndex);
      setPageSize(updated.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleViewDetails = (id) => {
    navigate(`/admin/doctor-view/${id}`);
  };

  const pageCount = table.getPageCount();

  return (
    <AdminLayout>
      <div className="container mt-3">
        <h2 className="mb-4">List of Doctors</h2>
        <Table bordered hover className="table-rounded">
          <thead className="table-dark">
            {table.getHeaderGroups().map((headerGroup) => (
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
          <tbody className="table-white">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => handleViewDetails(row.original.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>No data available</td>
              </tr>
            )}
          </tbody>
        </Table>
        <PaginationComponent
          pageIndex={pageIndex}
          pageCount={pageCount}
          onPageChange={(newPageIndex) => {
            if (newPageIndex >= 0 && newPageIndex < pageCount) {
              setPageIndex(newPageIndex);
            }
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default ListDoctors;
