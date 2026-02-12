import React, { useState } from 'react';
import Broadcaster from './broadcaster';
import Viewer from './viewer';

type Mode = 'broadcaster' | 'viewer' | null;

const LiveStreamApp: React.FC = () => {
    const [mode, setMode] = useState<Mode>(null);

    if (!mode) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
                <div className="max-w-md w-full space-y-6">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold text-gray-900 mb-2">
                            Live Streaming
                        </h1>
                        <p className="text-gray-600">
                            Choose your role to get started
                        </p>
                    </div>
                    
                    <button
                        onClick={() => setMode('broadcaster')}
                        className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition transform hover:scale-105 shadow-lg"
                    >
                        🎥 Start Broadcasting
                    </button>

                    <button
                        onClick={() => setMode('viewer')}
                        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition transform hover:scale-105 shadow-lg"
                    >
                        👁️ Watch Stream
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <button
                    onClick={() => setMode(null)}
                    className="mb-4 px-6 py-2 bg-white rounded-lg hover:bg-gray-50 shadow transition"
                >
                    ← Back
                </button>

                {mode === 'broadcaster' ? <Broadcaster /> : <Viewer />}
            </div>
        </div>
    );
};

export default LiveStreamApp;