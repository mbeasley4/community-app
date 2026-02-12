<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\ZegoCloudService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LiveStreamController extends Controller
{
    private ZegoCloudService $zegoService;

    public function __construct(ZegoCloudService $zegoService)
    {
        $this->zegoService = $zegoService;
    }

    /**
     * Get token for live streaming
     */
    public function getToken(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|string',
        ]);

        $userId = $request->input('user_id');
        $token = $this->zegoService->generateToken($userId);
        $appId = $this->zegoService->getAppId();

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'app_id' => $appId,
                'user_id' => $userId,
            ]
        ]);
    }

    /**
     * Create a live stream room
     */
    public function createRoom(Request $request): JsonResponse
    {
        $request->validate([
            'room_id' => 'required|string',
            'room_name' => 'required|string',
            'user_id' => 'required|string',
        ]);

        // You can store room details in database if needed
        // For now, just return success with room info

        return response()->json([
            'success' => true,
            'data' => [
                'room_id' => $request->input('room_id'),
                'room_name' => $request->input('room_name'),
                'created_by' => $request->input('user_id'),
                'created_at' => now(),
            ]
        ]);
    }

    /**
     * Join a live stream room
     */
    public function joinRoom(Request $request): JsonResponse
    {
        $request->validate([
            'room_id' => 'required|string',
            'user_id' => 'required|string',
        ]);

        $token = $this->zegoService->generateToken($request->input('user_id'));

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'room_id' => $request->input('room_id'),
            ]
        ]);
    }
}