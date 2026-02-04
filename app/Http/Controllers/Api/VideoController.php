<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function index(Request $request)
    {
        $query = Video::with('category')->orderBy('id', 'desc');

        if ($request->filled('category')) {
            $slug = $request->query('category');
            $query->whereHas('category', fn($q) => $q->where('slug', $slug));
        }

        if ($request->filled('q')) {
            $search = $request->query('q');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        return response()->json($query->paginate(10));
    }

    public function show($id)
    {
        return response()->json(Video::with('category')->findOrFail($id));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'url' => ['required', 'url'],
            'category_id' => ['required', 'exists:categories,id'],
            'duration' => ['nullable', 'integer', 'min:0'],
        ]);

        $video = Video::create($data);

        return response()->json($video, 201);
    }
}
