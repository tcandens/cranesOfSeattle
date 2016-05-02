import {createStore, compose, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from 'ducks/reducer';
import {persistStore, autoRehydrate} from 'redux-persist';

const loggerMiddleware = createLogger();

function configureMiddleware(initialState) {
  const store = createStore(
    rootReducer,
    initialState || {},
    compose(
      autoRehydrate(),
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware,
      ),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
  persistStore(store, {whitelist: 'user'});
  return store;
}

export default configureMiddleware();
