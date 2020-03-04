import RNFS from 'react-native-fs';
import { ProcessingManager } from 'react-native-video-processing';
import * as FileSystem from 'expo-file-system';
import { parse } from 'query-string';

// App
import * as constants from '../utils/constants';


function* copyVideoToTempLocation(item) {
  console.log('Copying: ', item.id);
  const t0 = new Date().getTime();
  const ext = parse(item.local_path).ext || 'mp4';
  const temp_path = yield RNFS.copyAssetsVideoIOS(
    item.local_path,
    `${RNFS.TemporaryDirectoryPath}${t0}.${ext.toLowerCase()}`,
  );

  const t1 = new Date().getTime();
  console.log(`Copying took ${(t1 - t0) / 1000} seconds.`);
  return temp_path;
}

export default function* compressIOS(item) {
  console.log('Start IOS Processing of: ', item.id);
  let localPath = item.local_path;

  let origin;
  try {
    origin = yield ProcessingManager.getVideoInfo(localPath);

    if (!origin.size && !origin.duration) { // assuming file doesn't exist
      localPath = yield copyVideoToTempLocation(item);
      origin = yield ProcessingManager.getVideoInfo(localPath);
    }

    const originSize = Math.round((origin.bitrate * origin.duration) / (8 * 1024 * 1024));

    if (originSize <= constants.TARGET_MAX_SIZE) {
      // Instead of processing much faster to copy
      if (localPath.indexOf('assets-library://') !== -1) {
        localPath = yield copyVideoToTempLocation(item);
        origin = yield ProcessingManager.getVideoInfo(localPath);
      }

      return {
        filePath: localPath,
        copyPath: localPath !== item.local_path ? localPath : null,
      };
    }

    console.log('IOS ProcessingManager.getVideoInfo: ', origin.duration, origin.size, origin.frameRate, origin.bitrate);

    const options = {
      width: origin.size && origin.size.width / 3,
      height: origin.size && origin.size.height / 3,
      bitrateMultiplier: Math.floor(origin.bitrate / constants.TARGET_BITRATE),
    };

    const t0 = new Date().getTime();
    const result = yield ProcessingManager.compress(localPath, options); // like VideoPlayer compress options

    const t1 = new Date().getTime();

    const directoryData = yield FileSystem.getInfoAsync(result);
    const currentSize = Math.round(directoryData.size / (1024 * 1024));

    return {
      filePath: result,
      copyPath: localPath !== item.local_path ? localPath : null,
    };
  } catch (err) {
    console.error(err);
  }

  return {
    filePath: null,
    copyPath: null,
  };
}
