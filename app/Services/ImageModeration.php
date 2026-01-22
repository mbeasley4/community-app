<?php

namespace App\Services;

class ImageModeration
{
    public static function imageIsSafe(string $absolutePath): bool
    {
        // Temporary: allow all images
        return true;
    }
}
