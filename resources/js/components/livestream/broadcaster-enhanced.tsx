import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { useZegoCloud } from '@/hooks/useZegoCloud';
import { livestreamApi } from '@/services/livestreamApi';
import { generateStreamId, ZEGO_CONFIG } from '@/constants/zegocloud';
import { storage, STORAGE_KEYS } from '@/utils/localStorage';

interface BroadcasterState {
    roomId: string;
    roomName: string;
    userId: string;
    isLive: boolean;
    isLoading: boolean;
    error: string;
    viewerCount: number;
}

const BroadcasterEnhanced: React.FC = () => {
    const [state, setState] = useState<BroadcasterState>({
        roomId: storage.get(STORAGE_KEYS.LAST_ROOM_ID) || '',
        roomName: '',
        userId: storage.get(STORAGE_KEYS.USER_ID) || '',
        isLive: false,
        isLoading: false,
        error: '',
        viewerCount: 0
    });

    const videoRef = useRef<HTMLVideoElement>(null);

    const {
        initZegoCloud,
        loginRoom,
        logoutRoom,
        startPublishingStream,
        stopPublishingStream,
        isInitialized,
        zg
    } = useZegoCloud();

    useEffect(() => {
        // Save user preferences
        if (state.userId) {
            storage.set(STORAGE_KEYS.USER_ID, state.userId);
        }
        if (state.roomId) {
            storage.set(STORAGE_KEYS.LAST_ROOM_ID, state.roomId);
        }
    }, [state.userId, state.roomId]);

    useEffect(() => {
        // Listen for room user updates
        if (zg && state.isLive) {
            zg.on('roomUserUpdate', (roomID, updateType, userList) => {
                if (updateType === 'ADD') {
                    setState(prev => ({
                        ...prev,
                        viewerCount: prev.viewerCount + userList.length
                    }));
                } else if (updateType === 'DELETE') {
                    setState(prev => ({
                        ...prev,
                        viewerCount: Math.max(0, prev.viewerCount - userList.length)
                    }));
                }
            });
        }
    }, [zg, state.isLive]);

    const updateState = (updates: Partial<BroadcasterState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    const startBroadcast = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!state.roomId || !state.userId || !state.roomName) {
            updateState({ error: 'Please fill in all fields' });
            return;
        }

        updateState({ isLoading: true, error: '' });

        try {
            const { token, app_id } = await livestreamApi.getToken(state.userId);
            await livestreamApi.createRoom(state.roomId, state.roomName, state.userId);

            if (!isInitialized) {
                await initZegoCloud(app_id, ZEGO_CONFIG.SERVER);
            }

            await loginRoom(state.roomId, token, state.userId, `Broadcaster_${state.userId}`);

            const streamId = generateStreamId(state.roomId, state.userId);
            await startPublishingStream(streamId, videoRef.current);

            updateState({ isLive: true });
            console.log('Broadcast started successfully');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to start broadcast';
            console.error('Failed to start broadcast:', err);
            updateState({ error: errorMessage });
        } finally {
            updateState({ isLoading: false });
        }
    };

    const stopBroadcast = async () => {
        updateState({ isLoading: true });
        try {
            const streamId = generateStreamId(state.roomId, state.userId);
            await stopPublishingStream(streamId);
            await logoutRoom(state.roomId);
            updateState({ isLive: false, viewerCount: 0 });
            console.log('Broadcast stopped');
        } catch (err) {
            console.error('Failed to stop broadcast:', err);
            updateState({ error: 'Failed to stop broadcast' });
        } finally {
            updateState({ isLoading: false });
        }
    };

    useEffect(() => {
        return () => {
            if (state.isLive) {
                stopBroadcast();
            }
        };
    }, [state.isLive]);

    return (
        <div className="broadcaster-container p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Start Live Broadcast</h1>

            {state.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {state.error}
                </div>
            )}

            {!state.isLive ? (
                <form onSubmit={startBroadcast} className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">User ID</label>
                        <input
                            type="text"
                            value={state.userId}
                            onChange={(e) => updateState({ userId: e.target.value })}
                            placeholder="Enter your user ID"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Room ID</label>
                        <input
                            type="text"
                            value={state.roomId}
                            onChange={(e) => updateState({ roomId: e.target.value })}
                            placeholder="Enter room ID"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Room Name</label>
                        <input
                            type="text"
                            value={state.roomName}
                            onChange={(e) => updateState({ roomName: e.target.value })}
                            placeholder="Enter room name"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={state.isLoading}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 transition"
                    >
                        {state.isLoading ? 'Starting...' : '🔴 Go Live'}
                    </button>
                </form>
            ) : (
                <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="bg-red-600 text-white px-4 py-2 rounded-lg inline-block animate-pulse">
                            🔴 LIVE
                        </div>
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                            👥 {state.viewerCount} viewers
                        </div>
                    </div>
                    <p className="text-lg font-semibold">Room: {state.roomName}</p>
                    <p className="text-sm text-gray-600">Room ID: {state.roomId}</p>
                </div>
            )}

            <div className="video-container bg-black rounded-lg overflow-hidden relative">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full aspect-video"
                />
                {!state.isLive && (
                    <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-900">
                        <p>Preview will appear here</p>
                    </div>
                )}
            </div>

            {state.isLive && (
                <button
                    onClick={stopBroadcast}
                    disabled={state.isLoading}
                    className="w-full mt-4 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 disabled:bg-gray-400 transition"
                >
                    {state.isLoading ? 'Stopping...' : 'End Broadcast'}
                </button>
            )}
        </div>
    );
};

export default BroadcasterEnhanced;