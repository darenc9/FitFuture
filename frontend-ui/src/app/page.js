"use client";
import React from 'react';
import { Authenticator } from "@aws-amplify/ui-react";

function Home() {
  return (
      <Authenticator>
      {({ signOut, user }) => (
        <main className="flex flex-col items-center justify-center">
          <h1 className="mb-4 text-2xl font-bold">Hello {user?.username}</h1>
          <button onClick={signOut} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"> Sign out</button>
        </main>
      )}
  </Authenticator>
  );
}
export default Home;