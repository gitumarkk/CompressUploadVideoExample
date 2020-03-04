export const BASE_URL = 'http://192.168.2.11:8001';

// Video Conversion
export const TARGET_BITRATE = 1200000;
export const TARGET_VIDEO_LENGTH = 60 * 3;
export const TARGET_MAX_SIZE = 30; // 'MB'
export const bitRateToSize = (bitrate) => bitrate / (8 * 1024 * 1024);
