// page to view a specific history entry's details
"use client"

import HistoryDetails from "@/components/history/HistoryDetails";
import { Suspense } from "react";

const HistoryDetailsWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HistoryDetails />
    </Suspense>
  )
};

export default HistoryDetailsWrapper;
