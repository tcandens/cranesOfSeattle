import passport from 'koa-passport';
import GooglePassport from 'passport-google-oauth20';
import userModel from '../models/user';
import path from 'path';
import Debug from 'debug';

const debug = Debug('auth/passport');
const GoogleStrategy = GooglePassport.Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_OAUTH_ID,
  clientSecret: process.env.GOOGLE_OAUTH_SECRET,
  callbackURL: path.resolve(HOST, 'api/auth/google/callback')
},
(accessToken, refreshToken, profile, callback) => {
  debug(profile);
  callback(null, 'user');
}))

export default passport;
