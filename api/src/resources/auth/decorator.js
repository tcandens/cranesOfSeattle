import authRoutes from './router';
import passport from './passport';

export default function authDecorator(app) {
  app.use(passport.initialize());
  app.use(authRoutes(passport).routes());
  return app;
}
