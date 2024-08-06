"use client";
import { GetToken } from "@/components/AWS/GetToken";
import ProgressGraph from "@/components/progress/ProgressGraph";
import { useAuthenticator, withAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchProgressData = async (id) => {
  try {
    const authToken = await GetToken();
    const res = await fetch(`${API_URL}/history/${id}/progress`, {headers: {'Authorization': `Bearer ${authToken}`}});
    if (!res.ok) {
      throw new Error('Failed to fetch progress data');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching progress data: ', error);
    return null;
  }
};

const ProgressPage = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.username) {
        const progressData = await fetchProgressData(user.username);
        // convert dates to unixTimes
        for (const exHistories of progressData) {
          for (const hist of exHistories) {
            hist.date = new Date(hist.date).getTime();
          }
        }
        console.log('progressData is:', progressData);
        setProgress(progressData);
        setLoading(false);
      } else {
        console.log('User is not yet defined.');
      }
    };
    fetchData();
  }, [user]);

  return (
    <div>
      {loading ? (
        <p>Loading progress page...</p>   // wait until we have fetched the progress
      ) : (
        <div className="container mx-auto px-4 h-[calc(100vh-80px)]">
          <h1 className="text-xl font-bold text-center">Your Top Exercises</h1>
          <ProgressGraph data={progress}/>
        </div>
      )}
    </div>
  );
};

export default withAuthenticator(ProgressPage);
