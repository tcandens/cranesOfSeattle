import passport from 'koa-passport';
import GooglePassport from 'passport-google-oauth20';
import dotenv from 'dotenv';
import url from 'url';
dotenv.config();

const Strategy = GooglePassport.Strategy;
const {HOST, GOOGLE_OAUTH_ID, GOOGLE_OAUTH_SECRET} = process.env;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

passport.use(new Strategy({
    clientID: GOOGLE_OAUTH_ID,
    clientSecret: GOOGLE_OAUTH_SECRET,
    callbackURL: url.resolve(HOST, '/api/auth/google/callback')
  },
  (token, tokenSecret, profile, done) => {
    return done(null, profile._json);
  }
));

export default passport;
