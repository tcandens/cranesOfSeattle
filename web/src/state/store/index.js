import {createStore, compose, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from 'ducks/reducer';

const loggerMiddleware = createLogger();

function configureMiddleware(initialState) {
  const store = createStore(
    rootReducer,
    initialState || {},
    compose(
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
      ),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
  return store;
}

export default configureMiddleware();
