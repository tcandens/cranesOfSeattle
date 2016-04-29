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
  profile = profile._json;
  // 1. Find or create user with profile details in DB.
  const _user = {
    google_id: profile.id,
    name: profile.displayName,
    image_url: profile.image.url
  }
  profile['emails'].forEach(email => {
    if (email.type === 'account') {
      _user.email = email.value;
    }
  });
  userModel.findOrCreate(_user).then(user => {
    callback(null, user);
  })
  // 2. Create JWT with user profile.
  // 3. Redirect with JWT encoded in the url for client to access.
}))

export default passport;
