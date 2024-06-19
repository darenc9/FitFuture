// components/AWS/ConfigureAmplify.js
import { Amplify } from 'aws-amplify';

const ConfigureAmplify = () => {
  try {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolClientId: process.env.AWS_COGNITO_CLIENT_ID,
          userPoolId: process.env.AWS_COGNITO_POOL_ID,
          signUpVerificationMethod: 'code', 
          loginWith: { // Optional
            oauth: {
              domain: process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN,
              scopes: ['openid','email','profile','aws.cognito.signin.user.admin'],
              redirectSignIn: ['http://localhost:3000'],
              redirectSignOut: ['http://localhost:3000/'],
              responseType: 'code',
            },
            username: 'true',
            email: 'true', // Optional
            birthdate: 'true',
            gender: 'false',
          }
        }
      }
    })} catch (error) {
    console.error('Error configuring Amplify:', error);
    // You might want to throw the error or handle it in some way
  }
};

export default ConfigureAmplify;
