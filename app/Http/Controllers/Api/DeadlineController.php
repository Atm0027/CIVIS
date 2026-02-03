<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Deadline;

class DeadlineController extends Controller
{
    public function index()
    {
        return response()->json(
            Deadline::query()->orderBy('id', 'asc')->get()
        );
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
