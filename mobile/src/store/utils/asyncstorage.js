import AsyncStorage from '@react-native-community/async-storage';
import uniqBy from 'lodash.uniqby';

export function* getNext() {
  let pendingVideoUploadList = yield AsyncStorage.getItem('pendingVideoUploadList');
  if (pendingVideoUploadList) {
    pendingVideoUploadList = JSON.parse(pendingVideoUploadList);
    if (Array.isArray(pendingVideoUploadList) && pendingVideoUploadList.length !== 0) {
     return pendingVideoUploadList[0];
    }
  }
}

export function* getList() {
  let pendingVideoUploadList = yield AsyncStorage.getItem('pendingVideoUploadList');

  if (pendingVideoUploadList) {
    pendingVideoUploadList = JSON.parse(pendingVideoUploadList);
  }

  if (Array.isArray(pendingVideoUploadList) && pendingVideoUploadList.length !== 0) {
    return pendingVideoUploadList;
  }

  return [];
}

export function* getItem(id) {
  const pendingVideoUploadList = yield getList();
  return pendingVideoUploadList.find(x => x.id === id)
}

export function updatePendingList(list, data) {
  if (!Array.isArray(list) || list.length === 0) return

  for (let index = 0; index < list.length; index++) {
    if(list[index].id === data.id) {
      list[index] = {
        ...list[index],
        ...data
      }
      break;
    }
  }
  return list;
};

export function* removeFromAyncStorage(item) {
  let pendingVideoUploadList = yield AsyncStorage.getItem('pendingVideoUploadList');

  if (pendingVideoUploadList) {
    pendingVideoUploadList = JSON.parse(pendingVideoUploadList);
    if (Array.isArray(pendingVideoUploadList) && pendingVideoUploadList.length !== 0) {
      pendingVideoUploadList = pendingVideoUploadList.filter(x => x.id !== item.id);
      yield AsyncStorage.setItem('pendingVideoUploadList', JSON.stringify(pendingVideoUploadList || []));
      return pendingVideoUploadList;
    }
  }

  return [];
};


export function* appendAsyncList(data) {
  let pendingVideoUploadList = yield AsyncStorage.getItem('pendingVideoUploadList');

  if (pendingVideoUploadList) {
    pendingVideoUploadList = JSON.parse(pendingVideoUploadList)
  } else {
    pendingVideoUploadList = [];
  }

  if (Array.isArray(data)) { // in the case of a bulk post
    pendingVideoUploadList = uniqBy([...pendingVideoUploadList, ...data], 'id');
  } else {
    pendingVideoUploadList = uniqBy([...pendingVideoUploadList, { id: data.id }], 'id');
  }

  yield AsyncStorage.setItem('pendingVideoUploadList', JSON.stringify(pendingVideoUploadList || []));
  return pendingVideoUploadList;
}
