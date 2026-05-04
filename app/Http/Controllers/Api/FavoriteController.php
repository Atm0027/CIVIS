<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class FavoriteController extends Controller
{
    /**
     * Lista todos los favoritos del usuario autenticado,
     * incluyendo los datos completos del vídeo y su categoría.
     */
    public function index(Request $request)
    {
        try {
            $favorites = $request->user()->favoriteVideos()->get();
            return response()->json($favorites);
        } catch (\Exception $e) {
            Log::error('[FavoriteController@index] Error: ' . $e->getMessage(), [
                'user_id' => $request->user()?->id,
                'trace'   => $e->getTraceAsString(),
            ]);
            return response()->json([
                'message' => 'Error al cargar favoritos.',
                'error'   => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    /**
     * Alterna el estado de favorito de un vídeo para el usuario autenticado.
     * Si no estaba en favoritos, lo añade. Si ya estaba, lo elimina.
     */
    public function toggle(Request $request, $videoId)
    {
        try {
            $user  = $request->user();
            $video = Video::findOrFail($videoId);

            $result = $user->favoriteVideos()->toggle($video->id);

            $isNowFavorite = count($result['attached']) > 0;

            return response()->json([
                'action'      => $isNowFavorite ? 'added' : 'removed',
                'video_id'    => $video->id,
                'is_favorite' => $isNowFavorite,
            ]);
        } catch (\Exception $e) {
            Log::error('[FavoriteController@toggle] Error: ' . $e->getMessage(), [
                'user_id'  => $request->user()?->id,
                'video_id' => $videoId,
                'trace'    => $e->getTraceAsString(),
            ]);
            return response()->json([
                'message' => 'Error al cambiar favorito.',
                'error'   => config('app.debug') ? $e->getMessage() : 'Server error',
            ], 500);
        }
    }

    /**
     * Comprueba si un vídeo concreto está en favoritos del usuario.
     */
    public function check(Request $request, $videoId)
    {
        try {
            $isFavorite = $request->user()
                ->favoriteVideos()
                ->where('video_id', $videoId)
                ->exists();

            return response()->json(['is_favorite' => $isFavorite]);
        } catch (\Exception $e) {
            Log::error('[FavoriteController@check] Error: ' . $e->getMessage());
            return response()->json(['is_favorite' => false]);
        }
    }

    /**
     * Devuelve los vídeos favoritos del usuario formateados como eventos de calendario.
     * Solo incluye vídeos que tengan process_start_date.
     */
    public function calendar(Request $request)
    {
        $favorites = $request->user()
            ->favoriteVideos()
            ->whereNotNull('process_start_date')
            ->get();

        $events = $favorites->map(function ($video) {
            return [
                'id'       => $video->id,
                'title'    => $video->title,
                'date'     => $video->process_start_date,
                'end_date' => $video->process_end_date,
                'type'     => 'favorite_video',
                'url'      => $video->url,
            ];
        })->sortBy('date')->values();

        return response()->json($events);
    }

    /**
     * Devuelve los próximos vídeos favoritos (por process_start_date).
     * Se usa en el widget de "Fechas próximas" del sidebar.
     */
    public function upcoming(Request $request)
    {
        $limit = $request->query('limit', 3);
        $today = Carbon::today()->toDateString();

        $upcoming = $request->user()
            ->favoriteVideos()
            ->where(function ($q) use ($today) {
                $q->where('process_start_date', '>=', $today)
                  ->orWhere('process_end_date', '>=', $today);
            })
            ->orderByRaw('COALESCE(process_start_date, process_end_date) ASC')
            ->limit($limit)
            ->get();

        // Formatear igual que el DeadlineItem del frontend espera
        $formatted = $upcoming->map(function ($video) {
            return [
                'id'         => $video->id,
                'title'      => $video->title,
                'end_date'   => $video->process_end_date ?? $video->process_start_date,
                'start_date' => $video->process_start_date,
                'type'       => 'favorite_video',
                'url'        => $video->url,
            ];
        });

        return response()->json($formatted);
    }
}
