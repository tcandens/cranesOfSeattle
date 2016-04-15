import passport from 'koa-passport';
import GooglePassport from 'passport-google-oauth20';
// import userModel from '../models/user';
import Debug from 'debug';
const debug = Debug('passportStrategy');

const Strategy = GooglePassport.Strategy;
const {GOOGLE_OAUTH_ID, GOOGLE_OAUTH_SECRET} = process.env;

passport.use(new Strategy({
    clientID: GOOGLE_OAUTH_ID,
    clientSecret: GOOGLE_OAUTH_SECRET,
    callbackURL: 'http://localhost:8080/api/auth/google/callback'
  },
  (token, tokenSecret, profile, done) => {
    console.log(token, tokenSecret, profile);
    done();
  }
));

export default passport;
