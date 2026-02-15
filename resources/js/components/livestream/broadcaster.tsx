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

        // IMPORTANT: Request permissions BEFORE ZEGOCLOUD initialization
        try {
            console.log('Requesting camera/microphone permissions...');
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });
            console.log('✅ Permissions granted');
            // Stop the test stream - ZEGOCLOUD will create its own
            stream.getTracks().forEach(track => track.stop());
        } catch (permError) {
            console.error('Permission denied:', permError);
            setError('Camera/microphone access denied. Please allow permissions and try again.');
            setIsConnecting(false);
            return;
        }

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

            // Set live BEFORE joining so container is visible
            setIsLive(true);
            setIsConnecting(false);

            // Use setTimeout to ensure React has rendered the container
            setTimeout(async () => {
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
                    },
                    onLeaveRoom: () => {
                        console.log('Left room');
                        setIsLive(false);
                    },
                });
            }, 100);

        } catch (err) {
            console.error('Failed to start broadcast:', err);
            setError(err instanceof Error ? err.message : 'Failed to start broadcast');
            setIsConnecting(false);
            setIsLive(false);
        }
    };

    const endBroadcast = () => {
        setIsLive(false);
    };

    return (
        <div className="broadcaster-container min-h-screen bg-gray-50">
            {/* Form - hide when live or connecting */}
            {!isLive && !isConnecting && (
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <h1 className="text-3xl font-bold mb-2 text-gray-900">Start Live Broadcast</h1>
                        <p className="text-gray-600 mb-8">Go live and connect with your community</p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start">
                                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={startBroadcast} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    User ID
                                </label>
                                <input
                                    type="text"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    placeholder="Enter your user ID"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Room ID
                                </label>
                                <input
                                    type="text"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    placeholder="Enter room ID"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Room Name <span className="text-gray-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    placeholder="Enter room name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isConnecting}
                                className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                            >
                                {isConnecting ? 'Connecting...' : '🔴 Go Live'}
                            </button>
                        </form>
                    </div>

                    {/* Tips Card */}
                    <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-6">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Broadcasting Tips
                        </h3>
                        <ul className="text-sm text-blue-800 space-y-2">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Ensure good lighting and a stable internet connection</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Test your camera and microphone before going live</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Share your room ID with viewers to join your stream</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Connecting state */}
            {isConnecting && (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="text-center bg-white rounded-2xl shadow-lg p-12">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-xl font-semibold text-gray-900 mb-2">Connecting to stream...</p>
                        <p className="text-sm text-gray-500">Initializing camera and microphone</p>
                    </div>
                </div>
            )}

            {/* Video Player Window */}
            {isLive && (
                <div className="w-full min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        {/* Live indicator banner */}
                        <div className="mb-4 bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                <span className="font-semibold text-gray-900">
                                    {roomName || `Room: ${roomId}`}
                                </span>
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                    LIVE
                                </span>
                            </div>
                            <button
                                onClick={endBroadcast}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-sm"
                            >
                                End Stream
                            </button>
                        </div>

                        {/* Video container */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                                <div 
                                    ref={containerRef} 
                                    className="absolute top-0 left-0 w-full h-full bg-black"
                                />
                            </div>
                        </div>

                        {/* Stream info */}
                        <div className="mt-4 bg-white rounded-xl shadow-sm p-4">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center space-x-4">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                        </svg>
                                        Broadcasting
                                    </span>
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        Room ID: {roomId}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Broadcaster;
