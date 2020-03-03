
// Npm
import { createSelector } from 'reselect';
import AsyncStorage from '@react-native-community/async-storage';
import { put, select, takeLatest, all, takeEvery } from 'redux-saga/effects';
import { ProcessingManager } from 'react-native-video-processing';
import Axios from 'axios';

// App
import { BASE_URL } from './utils/constants';
import compressVideoUtil from './compressor/index';
import * as asyncStorageUtils from './utils/asyncstorage';
import Base from './api';

// Constants for Actions
export const APP_NAME = 'app';

const ON_CHANGE = `${APP_NAME}/ON_CHANGE`;
const UPLOAD_VIDEO_REQUEST = `${APP_NAME}/UPLOAD_VIDEO_REQUEST`;
const SET_UPLOAD_VIDEO_LIST = `${APP_NAME}/SET_UPLOAD_VIDEO_LIST`;
const REMOVE_UPLOAD_VIDEO_LIST = `${APP_NAME}/REMOVE_UPLOAD_VIDEO_LIST`;


const UPDATE_ASYNC_LIST = `${APP_NAME}/UPDATE_ASYNC_LIST`;


export const onChange = (key, data) => {
  return {
    type: ON_CHANGE,
    data,
    key,
  };
};

export const uploadVideoRequest = (data) => {
  return {
    type: UPLOAD_VIDEO_REQUEST,
    data,
  }
}

export const setUploadVideoList = (data, params) => {
  return {
    type: SET_UPLOAD_VIDEO_LIST,
    data,
    params,
  }
};

export const removeUploadVideoList = (data) => {
  return {
    type: REMOVE_UPLOAD_VIDEO_LIST,
    data,
  }
};

const updateAsyncListAction = (data) => {
  return {
    type: UPDATE_ASYNC_LIST,
    data,
  }
};


function* onUploadProgress(progressEvent) {
  const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  yield put(onChange('currentUploadStats', { uploadPercent: percentCompleted, uploadId: item.id }));
}

function* _removeFromAyncStorage(item) {
  console.log('Removing: ', item.id)
  const pendingVideoUploadList = yield asyncStorageUtils.removeFromAyncStorage(item);
  yield put(onChange('pendingVideoUploadList', pendingVideoUploadList));
  yield uploadNextSaga();
};

function* _uploadCompressedVideo(uri, item, authToken) {
  const data = new FormData();
  const codec = 'mp4';

  data.append('file', {
    uri,
    name: item.title,
    type: `video/${codec}`,
  });

  try {
    console.log('Starting Upload :', item.id, " and file: ", uri);

    const resp = yield Axios({
      method: 'patch',
      url: `${BASE_URL}/api/v1/source/video/${item.id}/upload_video/`,
      data: data,
      onUploadProgress,
    });
    return resp;

  } catch (err) {
    console.error(err);
    yield put(onChange('currentUploadError', `There was an upload error of ${err.message} and status ${err.status}`));
  }
}


function* compressVideo(item) {
  try {
    const initialTime = new Date().getTime();

    let state = yield select();
    const authToken = state.app.authToken;

    const asyncItem = yield asyncStorageUtils.getItem(item.id);

    // Perhaps was interrupted in the middle of processing, don't want to reprocess again
    let _filePath;
    if (asyncItem && asyncItem.status === 'uploading' && asyncItem.processedPath) {
      try {
        const _origin = yield ProcessingManager.getVideoInfo(asyncItem.processedPath);
        if (_origin.size) { // assuming file exists
          _filePath = asyncItem.processedPath;
        }
      } catch (err) {}
    }

    let filePath;
    let copyPath;

    const beforeCompressionTime = new Date().getTime();

    if (_filePath) {
      filePath = _filePath;
    } else {
      let _res = yield compressVideoUtil(item, asyncItem);
      filePath = _res.filePath;
      copyPath = _res.copyPath;
    }

    if (copyPath) filePath = copyPath;

    if (!filePath) {
      // Perhaps add an error message here
      yield _removeFromAyncStorage({ id: item.id });
      return;
    }

    const beforeUploadTime = new Date().getTime();

    yield put(updateAsyncListAction({ id: item.id, status: 'uploading', processedPath: filePath }));

    const videoPatchResp = yield _uploadCompressedVideo(filePath, item, authToken);
    yield put(onChange('currentVideoUploading', null));
    yield put(onChange('currentUploadStats', { uploadPercent: null, uploadId: null }));

    // const videoApi = new Base('video', '/api/v1/source/video/');
    // yield put(videoApi.getRequest());

    yield _removeFromAyncStorage({ id: item.id });

    const finishUploadTime = new Date().getTime();

    // Need to get the async item here.
  } catch (err) {
    console.error(err);
  }
}

function* uploadAsync(data) {
  let state = yield select();

  // Do on at a time sequentially
  const url = `${BASE_URL}/api/v1/source/video/${data.id}/`;

  console.log('Upload Sync on: ', data.id);

  try {
    const resp = yield Axios({ method: 'get', url });
    if (state.app.currentVideoUploading) return;

    if (resp && resp.data && (!resp.data.video || !resp.data.videoUrl) && resp.data.local_path) {
      yield put(updateAsyncListAction({ id: data.id, status: 'compressing' }));
      yield compressVideo(resp.data);
    } else {
      yield _removeFromAyncStorage({ id: data.id });
    }
  } catch (err) {
    console.error(err);

    if (err.response && err.response.status === 404) {
      yield _removeFromAyncStorage({ id: data.id });
    } else {
      yield put(updateAsyncListAction({ id: data.id, status: 'error', error: true, message: err.message }));
    }
  }
}


function* setUploadVideoAsyncSaga(action) {
  try {
    const pendingVideoUploadList = yield asyncStorageUtils.appendAsyncList(action.data);
    yield put(onChange('pendingVideoUploadList', pendingVideoUploadList));
  } catch (err) {
    console.error(err);
  }
}

function* uploadNextSaga() {
  const pendingVideoUploadList =  yield asyncStorageUtils.getList();
  const asyncItem =  yield asyncStorageUtils.getNext();

  yield put(onChange('pendingVideoUploadList', pendingVideoUploadList));
  if (asyncItem) yield uploadAsync(asyncItem);
}

function* updateAsyncListSaga(action) {
  const state = yield select();
  const pendingVideoUploadList = asyncStorageUtils.updatePendingList(
    [...(state.app.pendingVideoUploadList || [])],
    action.data,
  );

  yield put(onChange('pendingVideoUploadList', pendingVideoUploadList));
  yield AsyncStorage.setItem('pendingVideoUploadList', JSON.stringify(pendingVideoUploadList || []));
}


const initialState = {};

export function* saga() {
  yield all([
    takeEvery(SET_UPLOAD_VIDEO_LIST, setUploadVideoAsyncSaga),
    takeLatest(UPLOAD_VIDEO_REQUEST, uploadNextSaga),
    takeEvery(UPDATE_ASYNC_LIST, updateAsyncListSaga),
  ]);
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ON_CHANGE: {
      return {
        ...state,
        [action.key]: action.data,
      }
    }

    default:
      return state;
  }
};

const selectGlobal = (state) => state[APP_NAME];

export const makeSelectBase = (key) => {
  return createSelector(
    selectGlobal,
    (globalState) => globalState[key],
  );
}
