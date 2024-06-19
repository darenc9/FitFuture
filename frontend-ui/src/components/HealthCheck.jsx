"use client"

import React, { useState, useEffect } from 'react';

export default function HealthCheck() {
  const [healthStatus, setHealthStatus] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  useEffect(() => {
    const fetchHealthStatus = async () => {
      try {
        const response = await fetch(`${API_URL}`);
        const data = await response.json();
        setHealthStatus(data.status);
      } catch (error) {
        console.error('Error fetching health status:', error);
        setHealthStatus('error');
      }
    };

    fetchHealthStatus();
  }, []);

  return (
    <section className="border rounded p-4 max-w-sm">
      <h2 className="mb-2">Health Status:</h2>
      {healthStatus === null ? (
        <p>Loading...</p>
      ) : healthStatus === 'ok' ? (
        <p>Status: OK</p>
      ) : (
        <p>Status: Error</p>
      )}
    </section>
  );
}
