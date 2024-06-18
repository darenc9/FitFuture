// src/atoms/exercisesPageAtoms.js
import { atom } from 'jotai';

export const currentPageAtom = atom(1);

export const filtersAtom = atom({
  name: "",
  muscle: "",
  category: "",
  force: "",
  level: "",
  mechanic: "",
  equipment: "",
});

export const exercisesAtom = atom([]);
export const totalExercisesAtom = atom(0);
export const loadingAtom = atom(true);
export const selectedExercisesAtom = atom([]);

export const fetchExercisesAtom = atom(async (get) => {
  const page = get(currentPageAtom);
  const filters = get(filtersAtom);
  const params = new URLSearchParams({
    page,
    limit: 10, // PAGE_SIZE
    ...filters,
  });

  const response = await fetch(`${process.env.API_URL}/exercises?${params.toString()}`);
  if (response.ok) {
    const result = await response.json();
    return { data: result.data, total: result.total };
  } else {
    console.error("Failed to fetch exercises");
    return { data: [], total: 0 };
  }
});
