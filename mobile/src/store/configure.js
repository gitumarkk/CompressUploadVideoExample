/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducers';
import { saga } from './init';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = {}) {
  const middlewares = [
    sagaMiddleware,
  ];

  const store = createStore(
    createReducer(),
    initialState,
    compose(
      applyMiddleware(...middlewares),
    ),
  );

  sagaMiddleware.run(saga);
  return store;
}
