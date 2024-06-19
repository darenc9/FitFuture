// src/app/exercises/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ExerciseTable from "@/components/exercises/ExerciseTable";
import SearchFilters from "@/components/exercises/SearchFilters";
import Pagination from "@/components/exercises/Pagination";
import { useAtom } from "jotai";
import { withAuthenticator } from "@aws-amplify/ui-react";
import {
  currentPageAtom,
  filtersAtom,
  exercisesAtom,
  totalExercisesAtom,
  loadingAtom,
  fetchExercisesAtom,
  selectedExercisesAtom,
} from "@/atoms/exercisesPageAtoms";

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

  const response = await fetch(`${process.env.API_URL}/exercises?${params.toString()}`);
  if (response.ok) {
    const result = await response.json();
    return result;
  } else {
    console.error("Failed to fetch exercises");
    return { data: [], total: 0 };
  }
};

function ExercisesPage() {
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const [pageInput, setPageInput] = useAtom(currentPageAtom);
  const [filters, setFilters] = useAtom(filtersAtom);
  const [exercises, setExercises] = useAtom(exercisesAtom);
  const [totalExercises, setTotalExercises] = useAtom(totalExercisesAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [fetchExercises] = useAtom(fetchExercisesAtom);
  const [selectedExercises, setSelectedExercises] = useAtom(selectedExercisesAtom);

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
      const { data, total } = await fetchExercises;
      setExercises(data);
      setTotalExercises(total);
      setLoading(false);
    };
    console.log("Updated state: (fetchData useEffect)", currentPage, filters, selectedExercises);
    fetchData();
  }, [currentPage, filters, selectedExercises]);

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
    <section className="p-0.5">
      <SearchFilters filters={filters} handleFilterChange={handleFilterChange} />
      {loading ? (
        <p className="text-center">Loading exercises...</p>
      ) : (
        <>
          <ExerciseTable exercises={exercises} selectedExercises={selectedExercises} setSelectedExercises={setSelectedExercises} />
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

export default withAuthenticator(ExercisesPage);