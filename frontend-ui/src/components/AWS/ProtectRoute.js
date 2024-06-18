import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthenticator } from '@aws-amplify/ui-react';

const ProtectRoute = ({ children }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login'); // Redirect to the login page
    }
  }, [user, router]);

  if (!user) {
    return <p>Loading...</p>; // Or a loading spinner
  }

  return <>{children}</>;
};

export default ProtectRoute;
