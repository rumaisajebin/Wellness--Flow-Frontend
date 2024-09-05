import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchAllPatients } from "./api/Api";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import AdminLayout from "../../component/AdminLayout";
import PaginationComponent from "../../component/PaginationComponent";
import { Table } from "reactstrap";
import { capitalizeFirstLetter } from "../../utils/textUtils";
const ListPatients = () => {
  const { access } = useSelector((state) => state.auth);
  const [patients, setPatients] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetchAllPatients(access);
        setPatients(response);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setError(
          "An error occurred while fetching patients. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [access]);

  const columns = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
      },
      {
        header: "Full Name",
        accessorKey: "full_name",
        cell: (info) => capitalizeFirstLetter(info.getValue()),
      },
      {
        header: "Age",
        accessorKey: "age",
      },
      {
        header: "Phone Number",
        accessorKey: "phone_number",
      },
      {
        header: "Gender",
        accessorKey: "gender",
        cell: (info) => capitalizeFirstLetter(info.getValue()),
      },
      {
        header: "Address",
        accessorKey: "address",
        cell: (info) => capitalizeFirstLetter(info.getValue()),
      },
      {
        header: "Action",
        accessorKey: "action",
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

  const data = useMemo(() => patients, [patients]);

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
    navigate(`/admin/patient-view/${id}`);
  };

  const pageCount = table.getPageCount();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <AdminLayout>
      <div className="container mt-3">
        <h2 className="mb-4">List of Patients</h2>
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
                <tr key={row.id}>
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

export default ListPatients;
