"use client";
import React, { useEffect, useState } from 'react';
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { GetToken } from '@/components/AWS/GetToken';
import { useAtom } from 'jotai';
import { profileAtom } from '../../store';
import FavouritesList from '@/components/favourites/FavouritesList';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchProfileData = async (id) => {
  try {
    const authToken = await GetToken();
    console.log(`API_URL is: ${API_URL}`);
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

  useEffect(() => {
    if (user && user.username) {
      const fetchData = async () => {
        const profileData = await fetchProfileData(user.username);
        // console.debug(`fetched profile data is:`, profileData);
        setProfile(profileData);
        setLoading(false);
      };
      fetchData();
    }
  }, [user]);

  return (
      <Authenticator>
      {({ signOut, user }) => (
        <main className="flex flex-col items-center justify-center">
          <h1 className="mb-4 text-2xl font-bold">Hello, {user?.username}!</h1>
          <button onClick={signOut} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"> Sign out</button>
          <div>
            <h1 className='font-bold text-xl p-2 text-center'>Your Favourites</h1>
            { loading ? (<p>Loading...</p>) : 
              (<FavouritesList key={profile.favourites} favWorkouts={profile?.favourites.workouts} favRoutines={profile?.favourites.routines}/>
            )}
            
          </div>
        </main>
      )}
  </Authenticator>
  );
}
export default Home;