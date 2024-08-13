import { fetchAuthSession } from 'aws-amplify/auth';

export async function GetToken() {
  try {
    const { tokens: session } = await fetchAuthSession({ forceRefresh: true });
    const idToken = session.idToken;
    return idToken;
  } catch (err) {
    console.error('Error getting auth token:', err);
    return null;
  }
}
