import React, { useRef, useState, FormEvent } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const Viewer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [roomId, setRoomId] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [isWatching, setIsWatching] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const joinStream = (e: FormEvent) => {
        e.preventDefault();
        
        if (!roomId || !userId) {
            setError('Please fill in all fields');
            return;
        }

        setError('');

        const appID = 1981858687;
        const serverSecret = "c046028f2fe8ddd3dac80a3ca7ad4a78";

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomId,
            userId,
            userId
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
            container: containerRef.current!,
            scenario: {
                mode: ZegoUIKitPrebuilt.LiveStreaming,
                config: {
                    role: ZegoUIKitPrebuilt.Audience,
                },
            },
            showPreJoinView: false,
            turnOnCameraWhenJoining: false,     // ✅ Viewers don't need camera
            turnOnMicrophoneWhenJoining: false, // ✅ Viewers don't need mic (unless you want interaction)
            showMyCameraToggleButton: false,    // ✅ Hide camera button for viewers
            showMyMicrophoneToggleButton: false,// ✅ Hide mic button for viewers
            showAudioVideoSettingsButton: true, // ✅ Let viewers adjust audio settings
            showTextChat: true,                 // ✅ Optional: Enable chat
            showUserList: false,                // ✅ Optional: Hide user list
            showScreenSharingButton: false,     // ✅ Viewers can't share screen
            onLeaveRoom: () => {
                setIsWatching(false);
            },
        });

        setIsWatching(true);
    };

    return (
        <div className="viewer-container min-h-screen bg-gray-100">
            {/* Form - hide when watching */}
            {!isWatching && (
                <div className="p-6 max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Watch Live Stream</h1>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={joinStream} className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">User ID</label>
                            <input
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Enter your user ID"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Room ID</label>
                            <input
                                type="text"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                placeholder="Enter room ID to join"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            👁️ Join Stream
                        </button>
                    </form>
                </div>
            )}

            {/* Horizontal Video Player Window - 16:9 aspect ratio */}
            {isWatching && (
                <div className="w-full min-h-screen bg-gray-900 p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Video container with 16:9 aspect ratio */}
                        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                            <div 
                                ref={containerRef} 
                                className="absolute top-0 left-0 w-full h-full bg-black rounded-xl shadow-2xl overflow-hidden"
                            />
                        </div>
                        
                        {/* Viewer info */}
                        <div className="mt-4 bg-gray-800 rounded-xl p-4 flex justify-between items-center">
                            <div className="text-white">
                                <span className="inline-block bg-red-600 px-2 py-1 rounded text-sm mr-2 animate-pulse">
                                    🔴 LIVE
                                </span>
                                <span className="font-semibold">
                                    Watching: {roomId}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsWatching(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
                            >
                                Leave
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden container for when not watching - so ref always exists */}
            {!isWatching && (
                <div ref={containerRef} style={{ display: 'none' }} />
            )}
        </div>
    );
};

export default Viewer;