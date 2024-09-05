// src/components/PaginationComponent.jsx
import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const PaginationComponent = ({ pageIndex, pageCount, onPageChange }) => {
  if (pageCount === 0) return null; // If no pages, don't render pagination
  const pages = Array.from({ length: pageCount }, (_, i) => i);

  return (
    <Pagination aria-label="Page navigation">
      <PaginationItem disabled={pageIndex === 0}>
        <PaginationLink previous onClick={() => onPageChange(pageIndex - 1)} />
      </PaginationItem>
      {pages.map((page) => (
        <PaginationItem key={page} active={page === pageIndex}>
          <PaginationLink onClick={() => onPageChange(page)}>
            {page + 1}
          </PaginationLink>
        </PaginationItem>
      ))}
      <PaginationItem disabled={pageIndex === pageCount - 1}>
        <PaginationLink next onClick={() => onPageChange(pageIndex + 1)} />
      </PaginationItem>
    </Pagination>
  );
};

export default PaginationComponent;

