"use client";

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="flex justify-between items-center mt-10">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={`py-2 px-5 font-semibold rounded
          ${page <= 1 ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 text-white"}
        `}
      >
        Previous
      </button>

      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`py-2 px-5 font-semibold rounded
          ${page >= totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 text-white"}
        `}
      >
        Next
      </button>
    </div>
  );
}
