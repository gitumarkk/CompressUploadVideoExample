// NPM
import * as FileSystem from 'expo-file-system';
import { ProcessingManager } from 'react-native-video-processing';

// App
import constants from '../utils/constants';

export default function* compressAndroid(item) {
  const t0 = new Date().getTime();

  try {
    console.log('Starting Compression for Android on: ', item.id, item.local_path);

    const origin = yield ProcessingManager.getVideoInfo(item.local_path);
    const directoryDataOld = yield FileSystem.getInfoAsync(item.local_path);
    const originSize = directoryDataOld.size / (1024 * 1024);

    if (originSize <= constants.TARGET_MAX_SIZE) {
      return {
        filePath: item.local_path,
        copyPath: null,
      };
    }

    const options = {
      width: origin.size && origin.size.width / 3,
      height: origin.size && origin.size.height / 3,
      bitrateMultiplier: 7,
      minimumBitrate: constants.TARGET_BITRATE / 5,
      removeAudio: false,
    };

    const result = yield ProcessingManager.compress(item.local_path, options);
    const { source } = result;

    const t1 = new Date().getTime();
    const directoryData = yield FileSystem.getInfoAsync(source);
    const _result = yield ProcessingManager.getVideoInfo(source);

    return {
      filePath: source,
      copyPath: null,
    };
  } catch (err) { console.error(err); }

  return {
    filePath: null,
    copyPath: null,
  };
}
