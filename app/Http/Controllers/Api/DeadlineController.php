<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Deadline;

class DeadlineController extends Controller
{
    public function index(Request $request)
    {
        $deadlines = Deadline::query()->orderBy('start_date', 'asc')->get();
        $videos = \App\Models\Video::whereNotNull('process_start_date')->get();

        $events = collect();

        foreach ($deadlines as $deadline) {
            $events->push([
                'id' => $deadline->id,
                'title' => $deadline->title,
                'date' => $deadline->start_date,
                'end_date' => $deadline->end_date,
                'type' => 'deadline'
            ]);
        }

        foreach ($videos as $video) {
            $events->push([
                'id' => $video->id,
                'title' => $video->title,
                'date' => $video->process_start_date,
                'end_date' => $video->process_end_date,
                'type' => 'video'
            ]);
        }

        $favoriteIds = $request->input('favorites', []);
        if (!empty($favoriteIds) && is_array($favoriteIds)) {
            $favoriteVideos = \App\Models\Video::whereIn('id', $favoriteIds)->get();
            foreach ($favoriteVideos as $fv) {
                // Avoid duplicating if they are already in the array as 'video'
                /* Optionally check: if (!$events->contains('id', $fv->id)) ... 
                   But we can just add them and frontend processes them or we can distinguish them. Let's add them. */
                $date = $fv->process_start_date ?? $fv->created_at->format('Y-m-d H:i:s');
                $events->push([
                    'id' => 'fav_' . $fv->id,
                    'title' => '⭐ Favorito: ' . $fv->title,
                    'date' => $date,
                    'end_date' => $fv->process_end_date,
                    'type' => 'favorite_video'
                ]);
            }
        }

        return response()->json($events->sortBy('date')->values());
    }

    public function upcoming(Request $request)
    {
        $limit = $request->query('limit', 2);

        return response()->json(
            Deadline::query()
                ->where('end_date', '>=', now())
                ->orderBy('end_date', 'asc')
                ->limit($limit)
                ->get()
        );
    }

    public function show($id)
    {
        return response()->json(Deadline::findOrFail($id));
    }
}
