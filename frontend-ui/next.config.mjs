/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      API_URL: process.env.API_URL,
      AWS_COGNITO_POOL_ID: process.env.AWS_COGNITO_POOL_ID,
      AWS_COGNITO_CLIENT_ID:process.env.AWS_COGNITO_CLIENT_ID,
      OAUTH_SIGN_IN_REDIRECT_URL: process.env.OAUTH_SIGN_IN_REDIRECT_URL,
      OAUTH_SIGN_OUT_REDIRECT_URL: process.env.OAUTH_SIGN_OUT_REDIRECT_URL,
      HUMANLOOP_API_KEY: process.env.HUMANLOOP_API_KEY,
    },
  };
  
  export default nextConfig;
  