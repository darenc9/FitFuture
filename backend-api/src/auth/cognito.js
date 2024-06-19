// src/auth/cognito.js

const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_COGNITO_POOL_ID,
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
  tokenUse: 'id',
});

jwtVerifier
  .hydrate()
  .then(() => {
    console.log('Cognito JWKS successfully cached');
  })
  .catch((err) => {
    console.error('Unable to cache Cognito JWKS', err);
  });

module.exports.strategy = () =>
  new BearerStrategy(async (token, done) => {
    try {
      // Verify this JWT
      const user = await jwtVerifier.verify(token);
      console.log('verified user token', user);

      done(null, user.email);
    } catch (err) {
      console.log('Could not verify token', err, token);
      done(null, false);
    }
  });

module.exports.authenticate = () => passport.authenticate('bearer', { session: false });