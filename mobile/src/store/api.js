// Npm
import {
  put, takeLatest, all,
} from 'redux-saga/effects';
import { createSelector } from 'reselect';
import Axios from 'axios';

// App
import { BASE_URL } from './utils/constants';
import { findAndReplace } from './utils/core';
import { uploadVideoRequest, setUploadVideoList } from './app';

const DEFAULT_STATE = {
  list: [],
  detail: {},
  params: {},
  loading: false,
  requesting: false,
  initialized: false,
  count: null,
};

class Base {
  constructor(appName, relativePath, options = {}) {
    this.APP_NAME = appName;

    this.URL = `${BASE_URL}${relativePath}`;

    this.GET_REQUEST = `${this.APP_NAME}/GET_REQUEST`;
    this.GET_SUCCESS = `${this.APP_NAME}/GET_SUCCESS`;
    this.GET_ERROR = `${this.APP_NAME}/GET_ERROR`;

    this.GET_DETAIL_REQUEST = `${this.APP_NAME}/GET_DETAIL_REQUEST`;
    this.GET_DETAIL_SUCCESS = `${this.APP_NAME}/GET_DETAIL_SUCCESS`;
    this.GET_DETAIL_ERROR = `${this.APP_NAME}/GET_DETAIL_ERROR`;

    this.POST_REQUEST = `${this.APP_NAME}/POST_REQUEST`;
    this.POST_SUCCESS = `${this.APP_NAME}/POST_SUCCESS`;
    this.POST_ERROR = `${this.APP_NAME}/POST_ERROR`;

    this.PUT_REQUEST = `${this.APP_NAME}/PUT_REQUEST`;
    this.PUT_SUCCESS = `${this.APP_NAME}/PUT_SUCCESS`;
    this.PUT_ERROR = `${this.APP_NAME}/PUT_ERROR`;

    this.PATCH_REQUEST = `${this.APP_NAME}/PATCH_REQUEST`;
    this.PATCH_SUCCESS = `${this.APP_NAME}/PATCH_SUCCESS`;
    this.PATCH_ERROR = `${this.APP_NAME}/PATCH_ERROR`;

    this.DELETE_REQUEST = `${this.APP_NAME}/DELETE_REQUEST`;
    this.DELETE_SUCCESS = `${this.APP_NAME}/DELETE_SUCCESS`;
    this.DELETE_ERROR = `${this.APP_NAME}/DELETE_ERROR`;

    this.SET_GET_PARAMS = `${this.APP_NAME}/SET_GET_PARAMS`;
    this.SET_DETAIL = `${this.APP_NAME}/SET_DETAIL`;

    this.RESET = `${this.APP_NAME}/RESET`;
    this.RESET_DETAIL = `${this.APP_NAME}/RESET_DETAIL`;

    this.saga = this.saga.bind(this);
    this.get = this.get.bind(this);
    this.getDetail = this.getDetail.bind(this);
    this.post = this.post.bind(this);
    this.patch = this.patch.bind(this);
  }

  reset = () => {
    return {
      type: this.RESET,
    };
  }

  resetDetail = () => {
    return {
      type: this.RESET_DETAIL,
    };
  }

  setGetParams = (data) => {
    return {
      type: this.SET_GET_PARAMS,
      data,
    };
  }

  setDetail = (data) => {
    return {
      type: this.SET_DETAIL,
      data,
    };
  }

  getRequest = (url, append, options = {}) => {
    return {
      type: this.GET_REQUEST,
      url,
      append,
      options,
    };
  }

  getSuccess = (data, append, options = {}) => {
    return {
      type: this.GET_SUCCESS,
      data,
      append,
      options,
    };
  }

  getError = (error, options = {}) => {
    return {
      type: this.GET_ERROR,
      error,
      options,
    };
  }

  getDetailRequest = (id, options = {}) => {
    return {
      type: this.GET_DETAIL_REQUEST,
      id,
      options,
    };
  }

  getDetailSuccess = (data, options = {}) => {
    return {
      type: this.GET_DETAIL_SUCCESS,
      data,
      options,
    };
  }

  getDetailError = (error, options = {}) => {
    return {
      type: this.GET_DETAIL_ERROR,
      error,
      options,
    };
  }

  postRequest = (data, options = {}) => {
    return {
      type: this.POST_REQUEST,
      data,
      options,
    };
  }

  postSuccess = (data, options = {}) => {
    return {
      type: this.POST_SUCCESS,
      data,
      options,
    };
  }

  postError = (error, options = {}) => {
    return {
      type: this.POST_ERROR,
      error,
      options,
    };
  }

  putRequest = (data, id, options = {}) => {
    return {
      type: this.PUT_REQUEST,
      data,
      id,
      options,
    };
  }

  putSuccess = (data, options = {}) => {
    return {
      type: this.PUT_SUCCESS,
      data,
      options,
    };
  }

  putError = (error, options = {}) => {
    return {
      type: this.PUT_ERROR,
      error,
      options,
    };
  }

  patchRequest = (data, id, options = {}) => {
    return {
      type: this.PATCH_REQUEST,
      data,
      id,
      options,
    };
  }

  patchSuccess = (data, options = {}) => {
    return {
      type: this.PATCH_SUCCESS,
      data,
      options,
    };
  }

  patchError = (error, options = {}) => {
    return {
      type: this.PATCH_ERROR,
      error,
      options,
    };
  }

  deleteRequest = (data, options = {}) => {
    return {
      type: this.DELETE_REQUEST,
      data,
      options,
    };
  }

  deleteSuccess = (data, options = {}) => {
    return {
      type: this.DELETE_SUCCESS,
      data,
      options,
    };
  }

  deleteError = (error, options = {}) => {
    return {
      type: this.DELETE_ERROR,
      error,
      options,
    };
  }

  reducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
      case this.RESET: {
        return {
          ...DEFAULT_STATE,
        };
      }

      case this.RESET_DETAIL: {
        return {
          ...state,
          detail: DEFAULT_STATE.detail,
        };
      }

      case this.SET_GET_PARAMS: {
        return {
          ...state,
          params: action.data,
        };
      }

      case this.SET_DETAIL: {
        return {
          ...state,
          detail: action.data,
        };
      }

      case this.GET_REQUEST: {
        return {
          ...state,
          loading: true,
        };
      }

      case this.GET_SUCCESS: {
        let list = [];
        if (action.append) {
          list = [
            ...state.list,
            ...(action.data && action.data.results || (action.data || [])),
          ];
        } else {
          list = action.data && action.data.results || (action.data || []);
        }
        return {
          ...state,
          loading: false,
          initialized: true,
          url: action.data.next,
          list,
          count: action.data && action.data.count,
        };
      }

      case this.GET_ERROR: {
        return {
          ...state,
          error: action.error,
          loading: false,
        };
      }

      case this.GET_DETAIL_REQUEST: {
        return {
          ...state,
          loading: true,
        };
      }

      case this.GET_DETAIL_SUCCESS: {
        return {
          ...state,
          loading: false,
          initialized: true,
          detail: action.data,
        };
      }

      case this.GET_DETAIL_ERROR: {
        return {
          ...state,
          error: action.error,
          loading: false,
        };
      }

      case this.POST_REQUEST: {
        return { ...state, loading: true };
      }

      case this.POST_SUCCESS: {
        const list = state.list || [];
        if (Array.isArray(list)) {
          list.unshift(action.data);
        }

        return {
          ...state,
          loading: false,
          detail: action.data,
          list,
        };
      }

      case this.POST_ERROR: {
        return {
          ...state,
          error: action.error,
          loading: false,
        };
      }

      case this.PATCH_REQUEST: {
        return { ...state, loading: true };
      }

      case this.PATCH_SUCCESS: {
        let list = state.list || [];
        if (Array.isArray(list)) {
          list = findAndReplace(
            list,
            { id: action.data.id },
            action.data,
          );
        }

        return {
          ...state,
          detail: action.data,
          loading: false,
          list,
        };
      }

      case this.PATCH_ERROR: {
        return {
          ...state,
          error: action.error,
          loading: false,
        };
      }

      default:
        return state;
    }
  }

  * get(action) {
    let url = this.URL;
    try {
      // Call using the request helper
      const resp = yield Axios({
        method: 'get',
        url: action.url || url,
      });
      yield put(this.getSuccess(resp.data, action.append));
    } catch (err) {
      yield put(this.getError(err));
    }
  }

  * getDetail(action) {
    const url = `${this.URL}${action.id}/`;
    try {
      // Call using the request helper
      const resp = yield Axios({
        method: 'get',
        url,
        headers,
      });
      yield put(this.getDetailSuccess(resp.data));
    } catch (err) {
      yield put(this.getDetailError(err));
    }
  }

  * post(action) {
    const url = this.URL;

    try {
      const resp = yield Axios({
        method: 'post',
        url,
        data: action.data,
      });
      yield put(this.postSuccess(resp.data));
      if (action.options && action.options.isUpload) {
        console.log('Do something');
        yield put(setUploadVideoList({ id: resp.data.id }));
        yield put(uploadVideoRequest());
      }

    } catch (err) {
      console.log(err);
      yield put(this.postError(err));
    }
  }

  * patch(action) {
    const url = `${this.URL}${action.id || action.data.id}/`;

    try {
      const resp = yield Axios({
        method: 'patch',
        url,
        data: action.data,
      });
      yield put(this.patchSuccess(resp.data));
    } catch (err) {
      yield put(this.patchError(err));
    }
  }

  sagaOverride = () => {
    return [];
  }

  * saga() {
    yield all([
      takeLatest(this.GET_REQUEST, this.get),
      takeLatest(this.GET_DETAIL_REQUEST, this.getDetail),
      takeLatest(this.POST_REQUEST, this.post),
      takeLatest(this.PATCH_REQUEST, this.patch),
      ...this.sagaOverride(),
    ]);
  }

  selectGlobal = (state) => state[this.APP_NAME]

  makeSelectBase = (key) => {
    return createSelector(
      this.selectGlobal,
      (globalState) => globalState[key],
    );
  }
}

export default Base;
