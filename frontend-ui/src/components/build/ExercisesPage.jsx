'use client';

import React, { useState, useEffect } from "react";
import ExerciseTable from "@/components/build/ExerciseTable";
import SearchFilters from "@/components/exercises/SearchFilters";
import Pagination from "@/components/exercises/Pagination";
import { useSearchParams } from "next/navigation";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { GetToken } from "../AWS/GetToken";

const PAGE_SIZE = 10;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  const authToken = await GetToken();
  const response = await fetch(`${API_URL}/exercises?${params.toString()}`, {headers: {'Authorization': `Bearer ${authToken}`}});
  if (response.ok) {
    const result = await response.json();
    return result;
  } else {
    console.error("Failed to fetch exercises");
    return { data: [], total: 0 };
  }
};

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [totalExercises, setTotalExercises] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageInput, setPageInput] = useState(1);

  const searchParams = useSearchParams();
  const from = searchParams.get('from'); 
  const workoutId = searchParams.get('workoutId'); 

  const [filters, setFilters] = useState({
    name: "",
    muscle: "",
    category: "",
    force: "",
    level: "",
    mechanic: "",
    equipment: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

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
          <ExerciseTable exercises={exercises} from={from} workoutId={workoutId}/>
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
};

export default withAuthenticator(ExercisesPage);
