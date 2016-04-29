import passport from 'koa-passport';
import GooglePassport from 'passport-google-oauth20';
import userModel from '../models/user';

const GoogleStrategy = GooglePassport.Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_OAUTH_ID,
  clientSecret: process.env.GOOGLE_OAUTH_SECRET,
  callbackURL: process.env.HOSTURL + 'api/auth/google/callback'
},
(accessToken, refreshToken, profile, callback) => {
  console.log(profile);
  callback(null, 'user');
}))

export default passport;
