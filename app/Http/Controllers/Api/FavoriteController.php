<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Lista todos los favoritos del usuario autenticado,
     * incluyendo los datos completos del vídeo y su categoría.
     */
    public function index(Request $request)
    {
        $favorites = $request->user()->favoriteVideos()->get();
        return response()->json($favorites);
    }

    /**
     * Alterna el estado de favorito de un vídeo para el usuario autenticado.
     * Si no estaba en favoritos, lo añade. Si ya estaba, lo elimina.
     */
    public function toggle(Request $request, $videoId)
    {
        $user  = $request->user();
        $video = Video::findOrFail($videoId);

        $result = $user->favoriteVideos()->toggle($video->id);

        $isNowFavorite = count($result['attached']) > 0;

        return response()->json([
            'action'     => $isNowFavorite ? 'added' : 'removed',
            'video_id'   => $video->id,
            'is_favorite' => $isNowFavorite,
        ]);
    }

    /**
     * Comprueba si un vídeo concreto está en favoritos del usuario.
     */
    public function check(Request $request, $videoId)
    {
        $isFavorite = $request->user()
            ->favoriteVideos()
            ->where('video_id', $videoId)
            ->exists();

        return response()->json(['is_favorite' => $isFavorite]);
    }
}
