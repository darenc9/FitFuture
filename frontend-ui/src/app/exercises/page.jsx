"use client";

import React, { useState, useEffect } from "react";

const PAGE_SIZE = 10;

const fetchExercises = async (page) => {
  const response = await fetch(`http://localhost:8080/exercises?page=${page}&limit=${PAGE_SIZE}`);
  if (response.ok) {
    const result = await response.json();
    return result;
  } else {
    console.error("Failed to fetch exercises");
    return { data: [], total: 0 };
  }
};

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [totalExercises, setTotalExercises] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageInput, setPageInput] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, total } = await fetchExercises(currentPage);
      setExercises(data);
      setTotalExercises(total);
      setLoading(false);
    };

    fetchData();
  }, [currentPage]);

  const totalPages = Math.ceil(totalExercises / PAGE_SIZE);

  const handlePageChange = (e) => {
    const newPage = Number(e.target.value);
    if (newPage > 0 && newPage <= totalPages) {
      setPageInput(newPage);
    } else {
      setPageInput(currentPage);
    }
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    if (pageInput > 0 && pageInput <= totalPages) {
      setCurrentPage(pageInput);
    }
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <section className="p-4">
      {loading ? (
        <p className="text-center">Loading exercises...</p>
      ) : (
        <>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/5 text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
                <th className="w-1/5 text-left py-3 px-4 uppercase font-semibold text-sm">Force</th>
                <th className="w-1/5 text-left py-3 px-4 uppercase font-semibold text-sm">Level</th>
                <th className="w-1/5 text-left py-3 px-4 uppercase font-semibold text-sm">Mechanic</th>
                <th className="w-1/5 text-left py-3 px-4 uppercase font-semibold text-sm">Equipment</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {exercises.map((exercise) => (
                <tr key={exercise.id}>
                  <td className="w-1/5 text-left py-3 px-4">
                    <a href={`http://localhost:3000/exercises/${encodeURIComponent(exercise.name)}`}>
                        {exercise.name}
                    </a>
                </td>
                  <td className="w-1/5 text-left py-3 px-4">{exercise.force}</td>
                  <td className="w-1/5 text-left py-3 px-4">{exercise.level}</td>
                  <td className="w-1/5 text-left py-3 px-4">{exercise.mechanic}</td>
                  <td className="w-1/5 text-left py-3 px-4">{exercise.equipment}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
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
                value={currentPage}
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
        </>
      )}
    </section>
  );
}
