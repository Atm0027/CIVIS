<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

        $paginated = $query->paginate(10);

        // Inyectar is_favorite si el usuario está autenticado (vía Sanctum Bearer token)
        $user = Auth::guard('sanctum')->user();
        $favoriteIds = $user
            ? $user->favoriteVideos()->pluck('videos.id')->map(fn($id) => (int) $id)->toArray()
            : [];

        $paginated->getCollection()->transform(function ($video) use ($favoriteIds) {
            $video->is_favorite = in_array((int) $video->id, $favoriteIds);
            return $video;
        });

        return response()->json($paginated);
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
            'process_start_date' => ['nullable', 'date'],
            'process_end_date' => ['nullable', 'date', 'after_or_equal:process_start_date'],
        ]);

        $video = Video::create($data);

        return response()->json($video, 201);
    }

    public function update(Request $request, $id)
    {
        $video = Video::findOrFail($id);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'url' => ['required', 'url'],
            'category_id' => ['required', 'exists:categories,id'],
            'duration' => ['nullable', 'integer', 'min:0'],
            'process_start_date' => ['nullable', 'date'],
            'process_end_date' => ['nullable', 'date', 'after_or_equal:process_start_date'],
        ]);

        $video->update($data);

        return response()->json($video);
    }

    public function destroy($id)
    {
        $video = Video::findOrFail($id);
        $video->delete();

        return response()->json(['message' => 'Video eliminado correctamente'], 200);
    }

    public function destroyBulk(Request $request)
    {
        $data = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['required', 'integer', 'exists:videos,id'],
        ]);

        $count = Video::whereIn('id', $data['ids'])->delete();

        return response()->json([
            'message' => "Se eliminaron {$count} videos correctamente",
            'count' => $count
        ], 200);
    }
}
