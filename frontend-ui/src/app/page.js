"use client";
import React, { useEffect, useState } from 'react';
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { GetToken } from '@/components/AWS/GetToken';
import { useAtom } from 'jotai';
import { profileAtom } from '../../store';
import FavouritesList from '@/components/favourites/FavouritesList';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchProfileData = async (id) => {
  try {
    const authToken = await GetToken();
    const res = await fetch(`${API_URL}/profile/user/${id}`, {headers: {'Authorization': `Bearer ${authToken}`}});
    if (!res.ok) {
      throw new Error('Failed to fetch profile data');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile data: ', error);
    return null;
  }
};

function Home() {
  const { user } = useAuthenticator((context) => [context.user]);
  const [profile, setProfile] = useAtom(profileAtom);
  const [loading, setLoading] = useState(true);
  const [showWorkouts, setShowWorkouts] = useState(true);
  const [showRoutines, setShowRoutines] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user && user.username) {
      const fetchData = async () => {
        const profileData = await fetchProfileData(user.username);
        if (!profileData) {
          // no profile, redirect to profile creation page
          router.push('/profile');
        } else {
          profileData.weight.sort((a, b) => a.timeStamp - b.timeStamp);
          setProfile(profileData);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleWOCheckboxChange = (e) => {
    setShowWorkouts(e.target.checked);
  };

  const handleRTCheckboxChange = (e) => {
    setShowRoutines(e.target.checked);
  };

  return (
      <Authenticator>
      {({ signOut, user }) => (
        <main className="flex flex-col items-center justify-center">
          <h1 className="mb-4 text-2xl font-bold">Hello, {user?.username}!</h1>
          <button onClick={signOut} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"> Sign out</button>
          <div>
            <h1 className='font-bold text-xl p-2 text-center'>Your Favourites</h1>
            { loading ? (<p>Loading...</p>) : (
              <div>
                <div className='flex gap-9 justify-center px-4 items-center'>
                  <div className='flex gap-2'>
                    <label className='text-sm'>Workouts</label>
                    <input
                    type='checkbox'
                    checked={showWorkouts}
                    onChange={handleWOCheckboxChange}
                    className='form-checkbox'
                    />
                  </div>
                  <div className='flex gap-2'>
                    <label className='text-sm'>Routines</label>
                    <input
                    type='checkbox'
                    checked={showRoutines}
                    onChange={handleRTCheckboxChange}
                    className='form-checkbox'
                    />
                  </div>
                </div>
                <FavouritesList key={profile.favourites}
                favWorkouts={profile?.favourites.workouts}
                favRoutines={profile?.favourites.routines}
                showWorkouts={showWorkouts}
                showRoutines={showRoutines}
                />
              </div>
            )}
            
          </div>
        </main>
      )}
  </Authenticator>
  );
}

export default Home;
