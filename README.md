# FitFuture

# Table of Contents

1. [Installation Guide](#installation-guide)
   
    1.1. [Prerequisites](#prerequisites)
   
    1.2. [Installation](#installation)
   
    1.3. [Environment Variables](#environment-variables)
   
    1.4. [Service Setup](#service-setup)
   
    1.5. [Locally running the app](#locally-running-the-app)
   
    1.6. [Deployment with Vercel](#deployment-with-vercel)
   
2. [Table of Deviations](#table-of-deviations)

3. [Usage Instructions](#usage-instructions)

   2.1. [Account Setup](#account-setup)
   
   2.2. [App Navigation](#app-navigation)

# Installation Guide

## Prerequisites
- Node.js (v16.x or higher)
- npm or yarn
- Git
- Vercel account (for deployment)
- MongoDB Atlas account
- Amazon Web Services (AWS) Account
- OpenAI account
- Humanloop Account

## Installation
1. Clone the repository
```
git clone https://github.com/darenc9/FitFuture.git
cd FitFuture
```
2. Install dependencies
   - Run `npm install` on both directories: `frontend-ui` and `backend-api`
#### Environment Variables
    - To run the project, you will need to set up a `.env` for both `frontend-ui` and the `backend-api`
   - **backend-api .env:**
```
PORT=8080
MONGO_URL=
AWS_COGNITO_POOL_ID=
AWS_COGNITO_CLIENT_ID=
```

   - **frontend-ui .env:**
```
NEXT_PUBLIC_API_URL= 
AWS_COGNITO_POOL_ID=
AWS_COGNITO_CLIENT_ID=
OAUTH_SIGN_IN_REDIRECT_URL=
OAUTH_SIGN_OUT_REDIRECT_URL=
NEXT_PUBLIC_AWS_COGNITO_DOMAIN=
NEXT_PUBLIC_HUMANLOOP_API_KEY=
HUMANLOOP_API_KEY=
NEXT_PUBLIC_OPENAI_KEY=
```
#### Service Setup
- `Amazon Cognito`: Setup Amazon Cognito by creating a User Pool and adding the values to your `.env`
- `MongoDB`: Sign up for an account, and create a new cluster and database. Plug the MongoDB URI to your `.env`
- `Vercel`: Sign up for a Vercel account, connect to your project (can use Github).
- `Humanloop`: Create a Humanloop account, add your OpenAI API to your account. Add the `HUMANLOOP_API_KEY` to your `.env`
- `OpenAI Playground`: Create an account and obtain your `OPENAI_API_KEY` and add it to the `.env`

#### Locally running the app
- Use `npm run start` in your `backend-api` directory
- Use `npm run dev` in your `frontend-ui` directory

#### Deployment with Vercel
- Set up your environment variables on Vercel
- There should be two projects: the frontend and the backend
- `backend` environment variables:
```
    MONGO_URL=
    AWS_COGNITO_POOL_ID=
    AWS_COGNITO_CLIENT_ID=  
```
- `frontend` environment variables:
```
    NEXT_PUBLIC_API_URL= 
    AWS_COGNITO_POOL_ID=
    AWS_COGNITO_CLIENT_ID=
    OAUTH_SIGN_IN_REDIRECT_URL=
    OAUTH_SIGN_OUT_REDIRECT_URL=
    NEXT_PUBLIC_AWS_COGNITO_DOMAIN=
    NEXT_PUBLIC_HUMANLOOP_API_KEY=
    HUMANLOOP_API_KEY=
```

Once your environment variables are set, your app will be live and ready to use.

# Table of Deviations

| Feature   | Notes   |
| --------- | ------- |
| Calorie Tracking | It was decided during the planning phase of this project that the calorie tracking feature would not be implemented due to time constraints.  The team determined that it would be more realistic to exclude the feature from the implementation of our app. |
| Apple/Google Authentication | The team originally thought of using Apple or Google authentication services to allow users to sign up and login, but we chose to use Amazon Cognito Authentication for those purposes instead. The authentication feature is not missing, it is simply using a different service than originally planned. |

# Usage Instructions

## Account Setup

To use the FitFuture app you must first sign up and create an account:
   1. navigate to `https://fit-future-ui.vercel.app/`
   2. click on the create account tab and enter your details
   3. wait for MFA code to be sent to the email you signed up with
   4. upon logging in, complete your profile with your details
   5. Begin using the app 

## App navigation
To navigate throughout the app, utilize the navbar at the top of the screen

### Home Page
This is where you can view your favourited workouts and routines in addition to signing out of your 
account. Clicking on a favourited item will take you to a page which will provide more details on them.
In the case of a routine, it will display each of the workouts in the routine and in the case of a 
workout it will display all exercises in the workout

### Profile Page
Navigating here will allow you to view your profile information, edit your profile in addition
to viewing your previously completed exercises. Upon navigation to this page you will be able to sort 
your history by a date range and by newest or oldest. In addition, clicking on a history entry will 
display all of the set and rep information for that completed exercise

### Browse Page
Navigating to this page will allow you to browse all preset and public workouts and routines that
others have created, in addition to also being able to view all exercises in the database collection.
Here you will also be able to see and favourite workouts and routines to make it easier
to find the ones you enjoy doing. Click on a specific workout, routine or exercise will provide you
with more details on it

### Progress Page
Here you will be able to view your progress for your weight in addition to the progression of
the weight you can do for your top three most done exercises

### Chatbot
This chatbot will be accessible from any other page, and you can ask it for any help with workout 
related information and suggestions
