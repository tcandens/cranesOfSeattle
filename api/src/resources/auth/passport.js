import passport from 'koa-passport';
import GooglePassport from 'passport-google-oauth20';
import FacebookPassport from 'passport-facebook';
import userModel from '../users/model';

const GoogleStrategy = GooglePassport.Strategy;
const FacebookStrategy = FacebookPassport.Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_OAUTH_ID,
  clientSecret: process.env.GOOGLE_OAUTH_SECRET,
  callbackURL: process.env.HOSTURL + 'api/auth/google/callback'
},
(accessToken, refreshToken, rawProfile, callback) => {
  const profile = rawProfile._json;
  const _user = {
    auth_provider: 'google',
    auth_provider_id: profile.id,
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
}))

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_OAUTH_ID,
  clientSecret: process.env.FACEBOOK_OAUTH_SECRET,
  callbackURL: process.env.HOSTURL + 'api/auth/facebook/callback',
  profileFields: ['id', 'picture', 'displayName', 'email']
},
(accessToken, refreshToken, rawProfile, callback) => {
  const profile = rawProfile._json;
  const _user = {
    auth_provider: 'facebook',
    auth_provider_id: profile.id,
    name: profile.name,
    email: profile.email,
    image_url: profile.picture.url
  }
  userModel.findOrCreate(_user).then(user => {
    callback(null, user);
  })
}))

export default passport;
