<?php 
namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
 
class EventSeeder extends Seeder 
{
    public function run(): void
    {
        $year = now()->year;
        $startDate = Carbon::create($year, 1, 5);

        for ($i = 0; $i < 40; $i++) {
            $date = $startDate->copy()->addDays($i);

            Event::create([
                'title' => 'Event for ' . $date->toFormattedDateString(),
                'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum fringilla pretium massa ut imperdiet.',
                'start_at' => $date->copy()->setTime(9, 0),
                'end_at' => $date->copy()->setTime(17, 0),
            ]);
        }
    }
}
