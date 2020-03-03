/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import reducers from './init';

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default () => {
  return combineReducers({
    ...reducers,
  });
}
