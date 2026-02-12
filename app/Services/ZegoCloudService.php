<?php

namespace App\Services;

use Firebase\JWT\JWT;

class ZegoCloudService
{
    private string $appId;
    private string $serverSecret;

    public function __construct()
    {
        $this->appId = (string) config('services.zegocloud.app_id');
        $this->serverSecret = (string) config('services.zegocloud.server_secret');
        
        // Validate that credentials are set
        if (empty($this->appId) || empty($this->serverSecret)) {
            throw new \RuntimeException('ZegoCloud credentials are not configured properly. Please check your .env file.');
        }
    }

    public function generateToken(string $userId, int $expireTime = 3600): string
    {
        $payload = [
            'app_id' => (int) $this->appId,
            'user_id' => $userId,
            'nonce' => random_int(1000000000, 9999999999),
            'ctime' => time(),
            'expire' => time() + $expireTime
        ];

        return JWT::encode($payload, $this->serverSecret, 'HS256');
    }

    public function getAppId(): int
    {
        return (int) $this->appId;
    }

    /**
     * Validate ZegoCloud credentials
     * 
     * @return array Validation result
     */
    public function validateCredentials(): array
    {
        return [
            'app_id' => $this->appId,
            'has_secret' => !empty($this->serverSecret),
            'secret_length' => strlen($this->serverSecret),
        ];
    }
}