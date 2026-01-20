<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function index(Request $request)
    {
        $query = Video::query()->orderBy('id', 'desc');

        if ($request->filled('category')) {
            $slug = $request->query('category');
            $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
        }

        return response()->json($query->paginate(10));
    }

    public function show($id)
    {
        return response()->json(Video::findOrFail($id));
    }
}
