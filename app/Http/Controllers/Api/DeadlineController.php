<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Deadline;

class DeadlineController extends Controller
{
    public function index()
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

        return response()->json($events->sortBy('date')->values());
    }

    public function upcoming(Request $request)
    {
        $limit = $request->query('limit', 2);

        // Asumiendo que start_date o end_date son el criterio
        // Simplemente ordenamos por fecha de inicio más próxima.
        // Como no tenemos structure completa, asumimos 'start_date' existe por migraciones previas
        return response()->json(
            Deadline::query()
                ->where('start_date', '>=', now())
                ->orderBy('start_date', 'asc')
                ->limit($limit)
                ->get()
        );
    }

    public function show($id)
    {
        return response()->json(Deadline::findOrFail($id));
    }
}
