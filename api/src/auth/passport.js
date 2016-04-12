import passport from 'koa-passport';
import GooglePassport from 'passport-google-oauth20';
import userModel from '../models/user';

const Strategy = GooglePassport.Strategy;
const {GOOGLE_OAUTH_ID, GOOGLE_OAUTH_SECRET} = process.env;

passport.use(new Strategy({
    clientID: GOOGLE_OAUTH_ID,
    clientSecret: GOOGLE_OAUTH_SECRET,
    callbackURL: 'http://localhost:8080/auth/google/callback'
  },
  (token, tokenSecret, profile, done) => {
    userModel.read(profile.id)
      .then(user => {
        if (user === null) {
          return userModel.create(profile)
            .then(user => {
              done(null, user);
            })
        }
        done(null, user)
      })
      .catch(error => {
        done(error);
      })
  }
));

export default passport;
