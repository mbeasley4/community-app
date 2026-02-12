export const ZEGO_CONFIG = {
    SERVER: 'wss://webliveroom-api.zego.im/ws',
    VIDEO_QUALITY: {
        LOW: 1,      // 360p
        MEDIUM: 2,   // 540p
        HIGH: 3,     // 720p
        ULTRA: 4     // 1080p
    },
    TOKEN_EXPIRE_TIME: 3600, // 1 hour
} as const;

export const STREAM_PREFIX = 'stream_';

export const generateStreamId = (roomId: string, userId: string): string => {
    return `${STREAM_PREFIX}${roomId}_${userId}`;
};