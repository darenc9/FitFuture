// src/app/history/[userId]/page.jsx
"use client"
import HistoryFilter from "@/components/history/HistoryFilter";
import HistoryList from "@/components/history/HistoryList";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// fetch all histories for user
const fetchHistoryData = async (id) => {
  try {
    const res = await fetch(`http://${API_URL}/histories/${id}`);
    if(!res.ok) {
      throw new Error('Failed to fetch history data');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching history data:', error);
    return null;
  }
};

// TODO: update this function to do something useful on a panel click
const handlePanelClick = async (item) => {
  console.log('clicked a history item...', item);
};

const ViewHistoryPage = ( { params } ) => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);

  const [catFilter, setCatFilter] = useState('all'); // Default category filter
  const [order, setOrder] = useState('newest'); // Default order filter
  const [startDate, setStartDate] = useState('2024-01-01'); // Default start date filter
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); // Default end date filter (show all)

  const reorderList = () => {
    console.log('reverse the history array');
    setHistory(history.reverse());
  }

  useEffect(() => {
    const fetchData = async () => {
      const historyData = await fetchHistoryData(params.userId);
      setHistory(historyData);
      setLoading(false);
    };
    fetchData();
  }, [params.userId]);

  useEffect(() => {
    let filtered = history;

    if (catFilter !== 'all') {
      filtered = filtered.filter(hist => hist.category.toLowerCase() === catFilter.toLowerCase());
    }
    
    if (Date.parse(startDate) && Date.parse(endDate)) {
      if (startDate < endDate) {
        filtered = filtered.filter(hist => {
          return (new Date(hist.date).toISOString().split('T')[0]) >= startDate && (new Date(hist.date).toISOString().split('T')[0])
        })
      }
    }

    setFilteredHistory(filtered);   // update the filtered list

    // if any of these states change, update the history list
  }, [history, catFilter, startDate, endDate, order])

  const handleFilterChange = (event) => {
    setCatFilter(event.target.value); // Update category filter state
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value); // Update start date filter state
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value); // Update end date filter state
  };

  const handleOrderChange = (event) => {
    setOrder(event.target.value); // Update order state
    reorderList();
  };

  return (
    <div>
      {loading ? (
        <p>Loading history page...</p>   // wait until we have fetched the history
      ) : (
        <div className="container mx-auto px-4 h-[calc(100vh-80px)]">
          <h1 className="font-bold text-xl text-center">Your Past Workouts</h1>
          <div>
            <HistoryFilter catFilter={catFilter}
                          startDate={startDate}
                          endDate={endDate}
                          order={order}
                          handleFilterChange={handleFilterChange}
                          handleStartDateChange={handleStartDateChange}
                          handleEndDateChange={handleEndDateChange}
                          handleOrderChange={handleOrderChange}
              />
          </div>
          <HistoryList histories={filteredHistory}
            handlePanelClick={handlePanelClick}/>
        </div>
      )}
    </div>
  )
};

export default ViewHistoryPage;
