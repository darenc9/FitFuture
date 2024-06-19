"use client"

import React, { useState, useEffect } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
async function currentSession() {
  try {
    const { tokens: session } = await fetchAuthSession({ forceRefresh: true });
    const idToken = session.idToken;
    return idToken;
  } catch (err) {
    console.log('Error getting auth token:', err);
    return null;
  }
}

export default function HealthCheck() {
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    const fetchHealthStatus = async () => {
      try {
        const token = await currentSession();
        const response = await fetch('http://localhost:8080/',
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
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
