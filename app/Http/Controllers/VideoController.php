<?php 

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Video;

class VideoController extends Controller
{
    public function index()
    {
        return Video::orderBy('created_at', 'desc')->get();
    }
}
 
 