<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaUploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'image', 'max:10240'],
        ]);

        $file = $request->file('file');
        $name = now()->format('YmdHis').'-'.Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $ext = $file->getClientOriginalExtension() ?: 'jpg';
        $path = $file->storeAs('uploads', "{$name}.{$ext}", 'public');

        return response()->json([
            'url' => Storage::disk('public')->url($path),
        ]);
    }
}
