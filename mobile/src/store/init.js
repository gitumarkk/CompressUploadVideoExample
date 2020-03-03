import { all } from 'redux-saga/effects';

import ReduxAPI from './api';

import appReducer, { saga as appSaga } from './app';

export const video = new ReduxAPI('video', '/api/v1/video/');


export default {
  video: video.reducer,
  app: appReducer,
};

export function* saga() {
  yield all([
    video.saga(),
    appSaga(),
  ]);
}
