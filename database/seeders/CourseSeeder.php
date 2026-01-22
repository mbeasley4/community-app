<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Lecture;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $course = Course::create([
            'title' => 'Whole30: Foundations',
            'description' => 'A sample course with lectures.',
            'image' => '/storage/courses/whole30.jpg',
        ]);

        $videos = [
            ['title' => 'Welcome', 'youtube_video_id' => 'dQw4w9WgXcQ','image' => '/storage/lectures/welcome.jpg'],
            ['title' => 'How the Program Works', 'youtube_video_id' => 'dQw4w9WgXcQ', 'image' => '/storage/lectures/welcome.jpg'],
            ['title' => 'Common Mistakes', 'youtube_video_id' => 'dQw4w9WgXcQ', 'image' => '/storage/lectures/welcome.jpg'],
        ];

        foreach ($videos as $i => $v) {
            Lecture::create([
                'course_id' => $course->id,
                'title' => $v['title'],
                'youtube_video_id' => $v['youtube_video_id'],
                'position' => $i + 1,
                'transcript' => "Transcript for {$v['title']}...\n\nAdd real content here.",
            ]);
        }
    }
}
