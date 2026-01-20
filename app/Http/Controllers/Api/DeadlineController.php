<?php

namespace App\Http\Controllers\Api;

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

    public function show($id)
    {
        return response()->json(Deadline::findOrFail($id));
    }
}
