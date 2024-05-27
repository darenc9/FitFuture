"use client";

import React, { useState, useEffect } from "react";
import ExerciseTable from "@/components/ExerciseTable";
import SearchFilters from "@/components/SearchFilters";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;

// Generates fetch API url and fetches for exercise data
const fetchExercises = async ({ page, name, muscle, category, force, level, mechanic, equipment }) => {
  const params = new URLSearchParams({
    page,
    limit: PAGE_SIZE,
    name,
    muscle,
    category,
    force,
    level,
    mechanic,
    equipment,
  });

  const response = await fetch(`http://localhost:8080/exercises?${params.toString()}`);
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
  const [filters, setFilters] = useState({
    name: "",
    muscle: "",
    category: "",
    force: "",
    level: "",
    mechanic: "",
    equipment: "",
  });

  // Handles search filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // When component state changes, attempt to re-fetch exercises
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, total } = await fetchExercises({ page: currentPage, ...filters });
      setExercises(data);
      setTotalExercises(total);
      setLoading(false);
    };

    fetchData();
  }, [currentPage, filters]);

  // Handles pagination
  const totalPages = Math.ceil(totalExercises / PAGE_SIZE);

  const handlePageChange = (e) => {
    const newPage = Number(e.target.value);
    setPageInput(newPage);
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

  useEffect(() => {
    setPageInput(currentPage);
  }, [currentPage]);

  return (
    <section className="p-4">
      <SearchFilters filters={filters} handleFilterChange={handleFilterChange} />
      {loading ? (
        <p className="text-center">Loading exercises...</p>
      ) : (
        <>
          <ExerciseTable exercises={exercises} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPrevPage={goToPrevPage}
            goToNextPage={goToNextPage}
            handlePageChange={handlePageChange}
            handlePageSubmit={handlePageSubmit}
            pageInput={pageInput}
          />
        </>
      )}
    </section>
  );
}
