import React, { useRef, useState, FormEvent } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const Broadcaster: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [roomId, setRoomId] = useState<string>('');
    const [roomName, setRoomName] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [isLive, setIsLive] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isConnecting, setIsConnecting] = useState<boolean>(false);

    const startBroadcast = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!roomId || !userId) {
            setError('Please fill in all fields');
            return;
        }

        setError('');
        setIsConnecting(true);

        try {
            const appID = 1981858687;
            const serverSecret = "c046028f2fe8ddd3dac80a3ca7ad4a78";

            console.log('Creating token for:', { roomId, userId });

            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret,
                roomId,
                userId,
                userId
            );

            console.log('Token created, initializing ZegoCloud...');

            const zp = ZegoUIKitPrebuilt.create(kitToken);

            console.log('Joining room...');

            await zp.joinRoom({
                container: containerRef.current!,
                scenario: {
                    mode: ZegoUIKitPrebuilt.LiveStreaming,
                    config: {
                        role: ZegoUIKitPrebuilt.Host,
                    },
                },
                showPreJoinView: false,
                turnOnCameraWhenJoining: true,
                turnOnMicrophoneWhenJoining: true,
                showScreenSharingButton: false,
                showMyCameraToggleButton: true,
                showMyMicrophoneToggleButton: true,
                showAudioVideoSettingsButton: true,
                showTextChat: true,
                showUserList: true,
                onJoinRoom: () => {
                    console.log('✅ Successfully joined room!');
                    setIsConnecting(false);
                    setIsLive(true);
                },
                onLeaveRoom: () => {
                    console.log('Left room');
                    setIsLive(false);
                },
            });

            console.log('Room join initiated');
            // Set live state after a short delay to ensure container is populated
            setTimeout(() => {
                if (!isLive) {
                    setIsConnecting(false);
                    setIsLive(true);
                }
            }, 2000);

        } catch (err) {
            console.error('Failed to start broadcast:', err);
            setError(err instanceof Error ? err.message : 'Failed to start broadcast');
            setIsConnecting(false);
        }
    };

    const endBroadcast = () => {
        setIsLive(false);
    };

    return (
        <div className="broadcaster-container min-h-screen bg-gray-100">
            {/* Form - hide when live or connecting */}
            {!isLive && !isConnecting && (
                <div className="p-6 max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6">Start Live Broadcast</h1>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={startBroadcast} className="space-y-4 mb-6">
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
                                placeholder="Enter room ID"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Room Name (Optional)</label>
                            <input
                                type="text"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                placeholder="Enter room name"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isConnecting}
                            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 transition"
                        >
                            {isConnecting ? 'Connecting...' : '🔴 Go Live'}
                        </button>
                    </form>
                </div>
            )}

            {/* Connecting state */}
            {isConnecting && (
                <div className="flex items-center justify-center min-h-screen bg-gray-900">
                    <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-xl">Connecting to stream...</p>
                        <p className="text-sm text-gray-400 mt-2">Initializing camera and microphone</p>
                    </div>
                </div>
            )}

            {/* Video Player Window */}
            {isLive && (
                <div className="w-full min-h-screen bg-gray-900 p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                            <div 
                                ref={containerRef} 
                                className="absolute top-0 left-0 w-full h-full bg-black rounded-xl shadow-2xl overflow-hidden"
                            />
                        </div>
                        
                        <div className="mt-4 bg-gray-800 rounded-xl p-4 flex justify-between items-center">
                            <div className="text-white">
                                <span className="inline-block bg-red-600 px-3 py-1 rounded text-sm mr-3 animate-pulse">
                                    🔴 LIVE
                                </span>
                                <span className="font-semibold">
                                    {roomName || roomId}
                                </span>
                            </div>
                            <button
                                onClick={endBroadcast}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                            >
                                End Stream
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden container */}
            {!isLive && !isConnecting && (
                <div ref={containerRef} style={{ display: 'none' }} />
            )}
        </div>
    );
};

export default Broadcaster;