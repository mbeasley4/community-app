import React, { useState } from 'react';
import Broadcaster from './broadcaster';
import Viewer from './viewer';

type Mode = 'broadcaster' | 'viewer' | null;

const LiveStreamApp: React.FC = () => {
    const [mode, setMode] = useState<Mode>(null);

    if (!mode) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-lg w-full">
                    {/* Header Card */}
                    <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
                                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Live Streaming
                            </h1>
                            <p className="text-gray-600">
                                Choose your role to get started
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={() => setMode('broadcaster')}
                            className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-orange-300 text-gray-900 py-6 px-6 rounded-xl font-semibold text-lg transition-all shadow-sm hover:shadow-md group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-gray-900">Start Broadcasting</div>
                                        <div className="text-sm text-gray-500 font-normal">Go live and share with your community</div>
                                    </div>
                                </div>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>

                        <button
                            onClick={() => setMode('viewer')}
                            className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-orange-300 text-gray-900 py-6 px-6 rounded-xl font-semibold text-lg transition-all shadow-sm hover:shadow-md group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-gray-900">Watch Stream</div>
                                        <div className="text-sm text-gray-500 font-normal">Join a live broadcast as a viewer</div>
                                    </div>
                                </div>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>

                    {/* Info Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Powered by FIT30 Live Streaming
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Button */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <button
                        onClick={() => setMode(null)}
                        className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </button>
                </div>
            </div>

            {/* Content */}
            <div>
                {mode === 'broadcaster' ? <Broadcaster /> : <Viewer />}
            </div>
        </div>
    );
};

export default LiveStreamApp;
