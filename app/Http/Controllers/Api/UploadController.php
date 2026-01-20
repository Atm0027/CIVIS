<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Upload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function index()
    {
        return response()->json(
            Upload::query()->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => ['required','file','max:10240'], // 10MB
        ]);

        $file = $request->file('file');

        $path = $file->store('uploads', 'public');

        $upload = Upload::create([
            'user_id'        => optional($request->user())->id,
            'disk'           => 'public',
            'path'           => $path,
            'original_name'  => $file->getClientOriginalName(),
            'mime'           => $file->getClientMimeType(),
            'size'           => $file->getSize(),
        ]);

        return response()->json($upload, 201);
    }

    public function destroy(Request $request, Upload $upload)
    {
        if ($upload->disk === 'public') {
            Storage::disk('public')->delete($upload->path);
        }

        $upload->delete();

        return response()->json(['message' => 'deleted']);
    }
}
