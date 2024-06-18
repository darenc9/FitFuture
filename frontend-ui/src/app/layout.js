"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import ConfigureAmplify from "@/components/AWS/ConfigureAmplify";
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from "aws-amplify";
import '@aws-amplify/ui-react/styles.css';
import Navbar from "@/components/navbar/Navbar";

ConfigureAmplify();
const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }) {
  const currentConfig = Amplify.getConfig();
  console.log("current Config: ", currentConfig);
  return (
    <html lang="en">
      <head>
        <title>FitFuture</title>
      </head>
      <Authenticator.Provider>
        
      <body className={`h-dvh ${inter.className}`}>
      <Navbar />
        {children}
      </body>
      </Authenticator.Provider>
    </html>
  );
}
