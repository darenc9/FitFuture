import React from "react";

const Pagination = ({ currentPage, totalPages, goToPrevPage, goToNextPage, handlePageChange, handlePageSubmit, pageInput }) => {
  return (
    <div className="flex justify-center mt-4 space-x-2 items-center">
      <button
        onClick={goToPrevPage}
        className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100"
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <form onSubmit={handlePageSubmit} className="flex items-center space-x-2">
        <input
          type="number"
          value={pageInput}
          onChange={handlePageChange}
          className="w-16 px-2 py-1 border rounded-lg text-center"
          min={1}
          max={totalPages}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100"
        >
          Go
        </button>
      </form>
      <button
        onClick={goToNextPage}
        className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
